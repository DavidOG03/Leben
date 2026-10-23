import { StateCreator } from "zustand";
import {
  fetchNotes,
  insertNote,
  updateNote as updateNoteDb,
  deleteNote as deleteNoteDb,
} from "@/lib/supabase/db";
import { createClient } from "@/lib/supabase/client";
import {
  encryptWithKey,
  decryptWithKey,
  getActiveVaultKey,
} from "@/utils/vaultCrypto";

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  notebook: string;
  pinned: boolean;
  archived: boolean;
  trashed: boolean;
  isLocked?: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export function generateNoteId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // RFC4122 v4 UUID fallback
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface NotesSlice {
  notes: Note[];
  notesLoaded: boolean;
  loadNotes: (force?: boolean) => Promise<void>;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

let activeFetchPromise: Promise<void> | null = null;

export const createNotesSlice: StateCreator<NotesSlice, [], [], NotesSlice> = (
  set,
  get,
) => ({
  notes: [],
  notesLoaded: false,

  setNotes: (notes: Note[]) => set({ notes }),

  loadNotes: async (force = false) => {
    const state = get() as any;
    if (state.notesLoaded && !force) return;
    if (activeFetchPromise) return activeFetchPromise;

    activeFetchPromise = (async () => {
      try {
        let uid = (get() as any).userId;
        if (!uid) {
          try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            uid = session?.user?.id;
            if (!uid) {
              const { data: { user } } = await supabase.auth.getUser();
              uid = user?.id;
            }
            if (uid) {
              set({ userId: uid } as any);
            }
          } catch {}
        }

        // If still no user, we are in guest mode: do NOT set notesLoaded = true
        // so that as soon as the user authenticates, loadNotes will execute.
        if (!uid) {
          return;
        }

        const cloudNotes = await fetchNotes();
        if (!Array.isArray(cloudNotes)) {
          return;
        }

        // Decrypt zero-knowledge personal notes if active vault key is in session
        const vaultKey = await getActiveVaultKey();
        const decryptedCloudNotes = await Promise.all(
          cloudNotes.map(async (n) => {
            if (n.content && n.content.startsWith("ENC:v1:")) {
              if (vaultKey) {
                try {
                  const plain = await decryptWithKey(n.content, vaultKey);
                  return { ...n, content: plain };
                } catch {
                  return n;
                }
              }
            }
            return n;
          })
        );

        const localNotes = ((get() as any).notes as Note[]) || [];
        // Preserve any local notes not yet in cloud (e.g. offline drafts)
        const localOnly = localNotes.filter(
          (n) => !decryptedCloudNotes.some((c) => c.id === n.id)
        );
        const mergedNotes = [...decryptedCloudNotes, ...localOnly];

        // Sort by updatedAt / createdAt descending
        mergedNotes.sort((a, b) => {
          const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return timeB - timeA;
        });

        set({ notes: mergedNotes, notesLoaded: true } as any);
      } catch (err) {
        console.error("Failed to load notes from Supabase:", err);
      } finally {
        activeFetchPromise = null;
      }
    })();

    return activeFetchPromise;
  },

  addNote: async (newNote: Note) => {
    set((state) => ({ notes: [newNote, ...state.notes] }));

    const isPersonal = newNote.notebook === "Personal" || Boolean(newNote.isLocked);
    let noteToPersist = newNote;

    if (isPersonal && newNote.content) {
      try {
        const vaultKey = await getActiveVaultKey();
        if (vaultKey) {
          const encContent = await encryptWithKey(newNote.content, vaultKey);
          noteToPersist = { ...newNote, content: encContent };
        }
      } catch (err) {
        console.warn("Client encryption fallback:", err);
      }
    }

    try {
      await insertNote(noteToPersist);
      (get() as any).addToast?.({
        message: "Note saved to Supabase database",
        type: "success",
      });
    } catch (err: any) {
      if (err?.message !== "guest_mode") {
        (get() as any).addOfflineMutation?.("insertNote", [noteToPersist]);
      }
    }
  },

  updateNote: async (id: string, updates: Partial<Note>) => {
    const now = new Date().toISOString();
    const mergedUpdates = { ...updates, updatedAt: now };

    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, ...mergedUpdates } : n
      ),
    }));

    const existing = (get() as any).notes.find((n: Note) => n.id === id);
    const isPersonal = (updates.notebook ?? existing?.notebook) === "Personal" || updates.isLocked || existing?.isLocked;
    let updatesToPersist = mergedUpdates;

    if (isPersonal && updates.content !== undefined && updates.content) {
      try {
        const vaultKey = await getActiveVaultKey();
        if (vaultKey) {
          const encContent = await encryptWithKey(updates.content, vaultKey);
          updatesToPersist = { ...mergedUpdates, content: encContent };
        }
      } catch (err) {
        console.warn("Client encryption fallback:", err);
      }
    }

    try {
      await updateNoteDb(id, updatesToPersist);
      (get() as any).addToast?.({
        message: "Note saved to Supabase database",
        type: "success",
      });
    } catch (err: any) {
      if (err?.message !== "guest_mode") {
        (get() as any).addOfflineMutation?.("updateNote", [id, updatesToPersist]);
      }
    }
  },

  deleteNote: async (id: string) => {
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    }));

    try {
      await deleteNoteDb(id);
    } catch (err: any) {
      if (err?.message !== "guest_mode") {
        (get() as any).addOfflineMutation?.("deleteNote", [id]);
      }
    }
  },
});
