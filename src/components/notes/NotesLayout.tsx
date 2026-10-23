"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import NotesSidebar from "./NotesSidebar";
import NotesList from "./NotesList";
import NotesEditor from "./NotesEditor";
import VaultSetupModal from "./VaultSetupModal";
import VaultLockModal from "./VaultLockModal";
import VaultResetModal from "./VaultResetModal";
import VaultRestoreModal from "./VaultRestoreModal";
import { useLebenStore } from "@/store/useStore";
import { generateNoteId } from "@/store/noteSlice";
import type { Note } from "@/store/noteSlice";
import { loadVaultState, persistVaultState } from "@/utils/vaultStorage";
import {
  createVaultCryptoBundle,
  tryUnlockVaultWithSecret,
  clearActiveVaultKey,
  updateVaultCredentials,
  getActiveVaultKey,
} from "@/utils/vaultCrypto";

export type { Note } from "@/store/noteSlice";

function notePreview(content: string): string {
  if (!content) return "";
  if (content.startsWith("ENC:v1:")) {
    return "🔒 Encrypted note — Unlock vault to view";
  }
  return content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]*>/g, " ")         // strip html tags
    .replace(/&nbsp;/gi, " ")          // decode & trim non-breaking spaces
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#\d+;/g, " ")
    .replace(/^#+\s+/gm, "")           // strip headings
    .replace(/~~|`|\*|_/g, "")        // strip inline markers
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")             // collapse multiple whitespace
    .trim()
    .substring(0, 120);
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function NotesLayout() {
  const router = useRouter();
  const userId = useLebenStore((s: any) => s.userId);
  const notes = useLebenStore((s: any) => s.notes as Note[]);
  const notesLoaded = useLebenStore((s: any) => s.notesLoaded);
  const loadNotes = useLebenStore((s: any) => s.loadNotes);
  const addNote = useLebenStore((s: any) => s.addNote);
  const updateNote = useLebenStore((s: any) => s.updateNote);
  const deleteNote = useLebenStore((s: any) => s.deleteNote);

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [vaultEnabled, setVaultEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return loadVaultState(userId).enabled;
    }
    return false;
  });
  const [vaultLocked, setVaultLocked] = useState(() => {
    if (typeof window !== "undefined") {
      const s = loadVaultState(userId);
      return s.enabled && s.locked;
    }
    return false;
  });
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [setupModalMode, setSetupModalMode] = useState<"setup" | "recovery_reset">("setup");
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Fetch fresh notes from Supabase on mount / screen refresh and sync vault state
  useEffect(() => {
    loadNotes(true);

    if (typeof window !== "undefined") {
      const state = loadVaultState(userId);
      setVaultEnabled(state.enabled);
      setVaultLocked(state.enabled && state.locked);
    }
  }, [userId, loadNotes]);

  // Refetch notes whenever user refocuses the browser window
  useEffect(() => {
    const handleFocus = () => {
      loadNotes(true);
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [loadNotes]);

  // Migrate any legacy localStorage notes to Supabase store
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("leben_notes");
        if (raw) {
          const localParsed: Note[] = JSON.parse(raw);
          if (Array.isArray(localParsed) && localParsed.length > 0 && notes.length === 0) {
            localParsed.forEach((n) => {
              addNote({
                ...n,
                id: n.id && n.id.includes("-") ? n.id : generateNoteId(),
              });
            });
            localStorage.removeItem("leben_notes");
          }
        }
      } catch {}
    }
  }, [addNote, notes.length]);

  /* ── Counts for Locked and Frozen notes ─────────────── */
  const lockedNotesCount = notes.filter(
    (n) => (n.notebook === "Personal" || n.isLocked) && !n.trashed
  ).length;

  const frozenNotesCount = notes.filter(
    (n) => n.notebook === "Frozen Vault" && !n.trashed
  ).length;

  /* ── CRUD ──────────────────────────────────────────── */

  const handleSetupVault = useCallback(() => {
    if (!userId) {
      router.push("/auth/signin");
      return;
    }
    setSetupModalMode("setup");
    setShowSetupModal(true);
  }, [userId, router]);

  const handleCreateNote = useCallback(async () => {
    const isPersonalTab = activeFilter === "notebook:Personal";
    if (isPersonalTab && !userId) {
      router.push("/auth/signin");
      return;
    }

    const now = new Date().toISOString();
    const defaultNotebook = isPersonalTab
      ? "Personal"
      : activeFilter.startsWith("notebook:")
        ? activeFilter.replace("notebook:", "")
        : "General";

    const newNote: Note = {
      id: generateNoteId(),
      title: "Untitled note",
      content: "",
      tags: [],
      notebook: defaultNotebook,
      pinned: false,
      archived: false,
      trashed: false,
      isLocked: isPersonalTab,
      createdAt: now,
      updatedAt: now,
    };
    await addNote(newNote);
    setSelectedNoteId(newNote.id);
  }, [activeFilter, addNote, userId, router]);

  const handleUpdateNote = useCallback(
    (id: string, updates: Partial<Pick<Note, "title" | "content" | "tags" | "notebook" | "pinned" | "isLocked">>) => {
      if ((updates.notebook === "Personal" || updates.isLocked) && !userId) {
        router.push("/auth/signin");
        return;
      }
      updateNote(id, updates);
    },
    [updateNote, userId, router]
  );

  const handleDeleteNote = useCallback(
    (id: string) => {
      const note = notes.find((n) => n.id === id);
      if (!note) return;
      if (note.trashed) {
        // Hard-delete permanently from Supabase
        deleteNote(id);
        if (selectedNoteId === id) setSelectedNoteId(null);
      } else {
        // Move to trash
        updateNote(id, { trashed: true });
        if (selectedNoteId === id) setSelectedNoteId(null);
      }
    },
    [notes, selectedNoteId, updateNote, deleteNote]
  );

  const handleRestoreNote = useCallback(
    (id: string) => {
      updateNote(id, { trashed: false });
    },
    [updateNote]
  );

  const handleArchiveNote = useCallback(
    (id: string, archived: boolean) => {
      updateNote(id, { archived });
    },
    [updateNote]
  );

  /* ── Vault Handlers (True Zero-Knowledge Client-Side Crypto) ── */

  const handleEnableVault = async (password: string, recoveryKey: string) => {
    if (!userId) {
      router.push("/auth/signin");
      return;
    }

    const state = loadVaultState(userId);
    const existingBundle = state.cryptoBundle;

    if (setupModalMode === "recovery_reset" && existingBundle) {
      // DRY: Re-wrap existing active vault key with new password & recovery key
      const activeKey = await getActiveVaultKey();
      const updatedBundle = await updateVaultCredentials(
        password,
        recoveryKey,
        existingBundle,
        activeKey,
      );
      await persistVaultState(userId, {
        enabled: true,
        locked: false,
        cryptoBundle: updatedBundle,
      });
      (useLebenStore.getState() as any).addToast?.({
        message: "New master password saved successfully",
        type: "success",
      });
    } else {
      // Generate true zero-knowledge client-side encryption bundle
      const { bundle } = await createVaultCryptoBundle(password, recoveryKey);
      await persistVaultState(userId, {
        enabled: true,
        locked: false,
        cryptoBundle: bundle,
      });
    }

    setVaultEnabled(true);
    setVaultLocked(false);
    setShowSetupModal(false);
    setSetupModalMode("setup");
    loadNotes(true);
  };

  const handleLockVault = useCallback(async () => {
    if (!userId) {
      router.push("/auth/signin");
      return;
    }
    clearActiveVaultKey();
    await persistVaultState(userId, { locked: true });
    setVaultLocked(true);
  }, [userId, router]);

  const handleUnlock = useCallback(
    async (secret: string): Promise<boolean | { success: boolean; error?: string }> => {
      const state = loadVaultState(userId);
      const bundle = state.cryptoBundle;

      if (!bundle) {
        return {
          success: false,
          error: "Vault security bundle not found. Please set up your vault.",
        };
      }

      const res = await tryUnlockVaultWithSecret(secret, bundle);
      if (!res.success) {
        return {
          success: false,
          error: res.error || "Incorrect master password or recovery key.",
        };
      }

      await persistVaultState(userId, { locked: false });
      setVaultLocked(false);
      setShowLockedModal(false);

      // Re-fetch / decrypt personal notes into view
      loadNotes(true);

      // DRY: If unlocked using Emergency Recovery Key, prompt user to create a new master password
      if (res.isRecoveryKey) {
        setSetupModalMode("recovery_reset");
        setShowSetupModal(true);
      }

      return { success: true };
    },
    [userId, loadNotes]
  );

  /* ── Option 3: Frozen Vault Reset & Restore ─────────── */

  // Freezes existing personal notes into a sealed archive, preserves old keys, and prompts for fresh setup
  const handleFreezeAndResetVault = useCallback(async () => {
    const personalNotes = notes.filter(
      (n) => n.notebook === "Personal" || n.isLocked
    );

    // Freeze all notes into the locked archive
    for (const n of personalNotes) {
      updateNote(n.id, {
        notebook: "Frozen Vault",
        archived: true,
        isLocked: true,
      });
    }

    const state = loadVaultState(userId);
    await persistVaultState(userId, {
      frozenPassword: state.password || undefined,
      frozenRecoveryKey: state.recoveryKey || undefined,
      enabled: false,
      locked: false,
      password: "",
      recoveryKey: "",
    });

    setVaultEnabled(false);
    setVaultLocked(false);
    setShowResetModal(false);
    setShowLockedModal(false);

    // Open fresh vault setup modal
    setShowSetupModal(true);
  }, [notes, updateNote, userId]);

  // Restores frozen notes back into active Personal vault when correct old password/key is entered
  const handleRestoreFrozenVault = useCallback((passwordOrKey: string): boolean | { success: boolean; error?: string } => {
    const state = loadVaultState(userId);
    const storedFrozenPwd = state.frozenPassword;
    const storedFrozenKey = state.frozenRecoveryKey;
    const activePwd = state.password;
    const activeKey = state.recoveryKey;

    const inputClean = passwordOrKey.trim();
    const inputUpper = inputClean.toUpperCase();
    const inputNorm = inputUpper.replace(/[^A-Z0-9]/g, "");

    const keyMatches = (stored?: string | null) => {
      if (!stored) return false;
      const sUpper = stored.trim().toUpperCase();
      const sNorm = sUpper.replace(/[^A-Z0-9]/g, "");
      return inputUpper === sUpper || (inputNorm.length >= 12 && inputNorm === sNorm);
    };

    const match =
      (storedFrozenPwd && inputClean === storedFrozenPwd) ||
      keyMatches(storedFrozenKey) ||
      (activePwd && inputClean === activePwd) ||
      keyMatches(activeKey);

    if (!match) {
      // Check if it belongs to another user
      const isKeyLike = inputUpper.startsWith("REC-") || inputNorm.length >= 16;
      if (isKeyLike && typeof window !== "undefined") {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (
            k &&
            k.startsWith("notes_vault_") &&
            (k.endsWith("_key") || k.endsWith("_frozen_key")) &&
            !k.includes("session")
          ) {
            const otherVal = (localStorage.getItem(k) || "").trim().toUpperCase();
            const otherNorm = otherVal.replace(/[^A-Z0-9]/g, "");
            if (otherVal && (inputUpper === otherVal || (inputNorm.length >= 12 && inputNorm === otherNorm))) {
              return {
                success: false,
                error: "This recovery key belongs to another user account on this device. Please use your own downloaded recovery key.",
              };
            }
          }
        }
      }
      return {
        success: false,
        error: "Invalid password or recovery key. Please check your spelling and try again.",
      };
    }

    // Unfreeze all notes and return to Personal vault
    const frozenNotes = notes.filter((n) => n.notebook === "Frozen Vault");
    for (const n of frozenNotes) {
      updateNote(n.id, {
        notebook: "Personal",
        archived: false,
        isLocked: false,
      });
    }

    persistVaultState(userId, {
      frozenPassword: "",
      frozenRecoveryKey: "",
    });
    return true;
  }, [notes, updateNote, userId]);

  const handleSelectNotebook = useCallback((notebook: string) => {
    if (notebook === "Personal" && !userId) {
      router.push("/auth/signin");
      return;
    }
    setActiveFilter(`notebook:${notebook}`);
    setSelectedNoteId(null);
    if (notebook === "Personal" && vaultEnabled && vaultLocked) {
      setShowLockedModal(true);
    }
  }, [userId, router, vaultEnabled, vaultLocked]);

  /* ── Filtering ─────────────────────────────────────── */

  const filteredNotes = notes.filter((note) => {
    const isPersonal =
      note.notebook === "Personal" || note.isLocked || note.notebook === "Frozen Vault";

    // 1. Personal Folder View: ONLY personal notes are returned
    if (activeFilter === "notebook:Personal") {
      if (note.notebook !== "Personal" || note.trashed || note.archived) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(q) ||
          notePreview(note.content).toLowerCase().includes(q) ||
          note.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    }

    // 2. All other tabs: Locked & Personal notes are strictly excluded!
    if (isPersonal) return false;

    // Search within accessible notes
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        note.title.toLowerCase().includes(q) ||
        notePreview(note.content).toLowerCase().includes(q) ||
        note.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeFilter === "pinned") return note.pinned && !note.trashed && !note.archived;
    if (activeFilter === "archived") return note.archived && !note.trashed;
    if (activeFilter === "trash") return note.trashed;
    if (activeFilter === "recent") {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return !note.trashed && !note.archived && new Date(note.updatedAt).getTime() > cutoff;
    }
    if (activeFilter.startsWith("notebook:")) {
      const nb = activeFilter.replace("notebook:", "");
      return note.notebook === nb && !note.trashed && !note.archived;
    }
    if (activeFilter.startsWith("tag:")) {
      const tag = activeFilter.replace("tag:", "");
      return note.tags.includes(tag) && !note.trashed && !note.archived;
    }
    return !note.archived && !note.trashed;
  });

  const rawSelectedNote = notes.find((n) => n.id === selectedNoteId) ?? null;
  const selectedNote =
    activeFilter !== "notebook:Personal" && (rawSelectedNote?.notebook === "Personal" || rawSelectedNote?.isLocked)
      ? null
      : rawSelectedNote;
  const isPersonalLocked = vaultEnabled && vaultLocked && selectedNote?.notebook === "Personal";

  return (
    <div className="flex flex-1 h-full overflow-hidden relative">
      {/* Left sidebar (Collapsible drawer on mobile, static aside on desktop) */}
      <NotesSidebar
        notes={notes}
        activeFilter={activeFilter}
        onFilterChange={(f) => {
          setActiveFilter(f);
          setSelectedNoteId(null);
          setMobileSidebarOpen(false);
        }}
        onSelectNotebook={(nb) => {
          handleSelectNotebook(nb);
          setMobileSidebarOpen(false);
        }}
        vaultEnabled={vaultEnabled}
        vaultLocked={vaultLocked}
        onSetupVault={handleSetupVault}
        onLockVault={handleLockVault}
        onUnlockVault={() => setShowLockedModal(true)}
        onRestoreFrozenVault={() => setShowRestoreModal(true)}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Middle list (Hidden on mobile if a note is selected) */}
      <NotesList
        notes={filteredNotes}
        selectedNoteId={selectedNoteId}
        onSelectNote={(id) => {
          if (id === "vault_locked_trigger") {
            setShowLockedModal(true);
            return;
          }
          const target = notes.find((n) => n.id === id);
          if (target?.notebook === "Personal" && vaultEnabled && vaultLocked) {
            setShowLockedModal(true);
          }
          setSelectedNoteId(id);
        }}
        activeFilter={activeFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateNote={handleCreateNote}
        onRestoreNote={handleRestoreNote}
        relativeTime={relativeTime}
        notePreview={notePreview}
        vaultLocked={vaultLocked && vaultEnabled}
        onOpenSidebar={() => setMobileSidebarOpen(true)}
      />

      {/* Right editor (Hidden on mobile if no note is selected) */}
      <NotesEditor
        note={selectedNote}
        allNotes={notes.filter((n) =>
          activeFilter === "notebook:Personal"
            ? n.notebook === "Personal"
            : n.notebook !== "Personal" && !n.isLocked && n.notebook !== "Frozen Vault"
        )}
        onSelectNote={setSelectedNoteId}
        onBackToList={() => setSelectedNoteId(null)}
        isLocked={isPersonalLocked}
        vaultEnabled={vaultEnabled}
        vaultLocked={vaultLocked}
        onSetupVault={handleSetupVault}
        onUnlockRequest={() => setShowLockedModal(true)}
        onUpdate={handleUpdateNote}
        onDelete={handleDeleteNote}
        onArchive={handleArchiveNote}
        onRestore={handleRestoreNote}
        relativeTime={relativeTime}
      />

      {/* Modals */}
      {showSetupModal && (
        <VaultSetupModal
          onClose={() => {
            setShowSetupModal(false);
            setSetupModalMode("setup");
          }}
          onEnable={handleEnableVault}
          mode={setupModalMode}
        />
      )}
      {showLockedModal && (
        <VaultLockModal
          onUnlock={handleUnlock}
          onClose={() => {
            setShowLockedModal(false);
            if (activeFilter === "notebook:Personal") {
              setActiveFilter("all");
            }
          }}
          onOpenResetModal={() => setShowResetModal(true)}
        />
      )}
      {showResetModal && (
        <VaultResetModal
          onClose={() => setShowResetModal(false)}
          onConfirmReset={handleFreezeAndResetVault}
          lockedNotesCount={lockedNotesCount}
        />
      )}
      {showRestoreModal && (
        <VaultRestoreModal
          onClose={() => setShowRestoreModal(false)}
          onRestore={handleRestoreFrozenVault}
          frozenNotesCount={frozenNotesCount}
        />
      )}
    </div>
  );
}
