import { StateCreator } from "zustand";
import {
  fetchNotes,
  insertNote,
  updateNote as updateNoteDb,
  deleteNote as deleteNoteDb,
} from "@/lib/supabase/db";

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
  loadNotes: () => Promise<void>;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const createNotesSlice: StateCreator<NotesSlice, [], [], NotesSlice> = (
  set,
  get,
) => ({
  notes: [],
  notesLoaded: false,

  setNotes: (notes: Note[]) => set({ notes }),

  loadNotes: async () => {
    const state = get() as any;
    if (state.notesLoaded) return;
    // Guest mode: no cloud fetch needed
    if (!state.userId) {
      set({ notesLoaded: true } as any);
      return;
    }
    const cloudNotes = await fetchNotes();
    const localNotes = ((get() as any).notes as Note[]) || [];
    const mergedNotes = [
      ...localNotes.filter((n) => !cloudNotes.some((c) => c.id === n.id)),
      ...cloudNotes,
    ];
    set({ notes: mergedNotes, notesLoaded: true } as any);
  },

  addNote: async (newNote: Note) => {
    set((state) => ({ notes: [newNote, ...state.notes] }));
    try {
      await insertNote(newNote);
    } catch (err: any) {
      if (err?.message !== "guest_mode") {
        (get() as any).addOfflineMutation?.("insertNote", [newNote]);
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

    try {
      await updateNoteDb(id, mergedUpdates);
    } catch (err: any) {
      if (err?.message !== "guest_mode") {
        (get() as any).addOfflineMutation?.("updateNote", [id, mergedUpdates]);
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
