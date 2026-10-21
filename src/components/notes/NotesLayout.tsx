"use client";

import { useState, useEffect, useCallback } from "react";
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

export type { Note } from "@/store/noteSlice";

function notePreview(content: string): string {
  if (!content) return "";
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
  const [vaultEnabled, setVaultEnabled] = useState(false);
  const [vaultLocked, setVaultLocked] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  // User-scoped vault key helper so Account A never locks Account B
  const getVaultKey = useCallback(
    (key: string) => (userId ? `notes_vault_${userId}_${key}` : `notes_vault_guest_${key}`),
    [userId]
  );

  // Sync vault security state scoped to current user & load notes
  useEffect(() => {
    if (!notesLoaded) {
      loadNotes();
    }

    if (typeof window !== "undefined") {
      // Clear legacy unscoped keys that previously contaminated all accounts on the same browser
      localStorage.removeItem("notes_vault_enabled");
      localStorage.removeItem("notes_vault_locked");
      localStorage.removeItem("notes_vault_pwd");
      localStorage.removeItem("notes_vault_key");

      const userEnabled = localStorage.getItem(getVaultKey("enabled")) === "true";
      const userLocked = localStorage.getItem(getVaultKey("locked")) !== "false";

      setVaultEnabled(userEnabled);
      setVaultLocked(userEnabled && userLocked);
    }
  }, [userId, getVaultKey, loadNotes, notesLoaded]);

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

  const handleCreateNote = useCallback(async () => {
    const now = new Date().toISOString();
    const isPersonalTab = activeFilter === "notebook:Personal";
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
  }, [activeFilter, addNote]);

  const handleUpdateNote = useCallback(
    (id: string, updates: Partial<Pick<Note, "title" | "content" | "tags" | "notebook" | "pinned">>) => {
      updateNote(id, updates);
    },
    [updateNote]
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

  /* ── Vault Handlers (Scoped to active user) ─────────── */

  const handleEnableVault = (password: string, recoveryKey: string) => {
    const key = (k: string) => getVaultKey(k);
    localStorage.setItem(key("enabled"), "true");
    localStorage.setItem(key("locked"), "false");
    localStorage.setItem(key("pwd"), password);
    localStorage.setItem(key("key"), recoveryKey);
    setVaultEnabled(true);
    setVaultLocked(false);
    setShowSetupModal(false);
  };

  const handleLockVault = useCallback(() => {
    localStorage.setItem(getVaultKey("locked"), "true");
    setVaultLocked(true);
  }, [getVaultKey]);

  const handleUnlock = useCallback(
    (password: string): boolean | { success: boolean; error?: string } => {
      const stored = localStorage.getItem(getVaultKey("pwd"));
      const storedKey = localStorage.getItem(getVaultKey("key"));

      const cleanInput = password.trim();
      const inputUpper = cleanInput.toUpperCase();
      const inputNorm = inputUpper.replace(/[^A-Z0-9]/g, "");

      // 1. Check direct password match
      if (stored && cleanInput === stored) {
        localStorage.setItem(getVaultKey("locked"), "false");
        setVaultLocked(false);
        setShowLockedModal(false);
        return { success: true };
      }

      // 2. Check recovery key for active account (case & formatting resilient)
      if (storedKey) {
        const storedKeyUpper = storedKey.trim().toUpperCase();
        const storedKeyNorm = storedKeyUpper.replace(/[^A-Z0-9]/g, "");

        if (inputUpper === storedKeyUpper || (inputNorm.length >= 12 && inputNorm === storedKeyNorm)) {
          localStorage.setItem(getVaultKey("locked"), "false");
          setVaultLocked(false);
          setShowLockedModal(false);
          return { success: true };
        }
      }

      // 3. User entered a recovery key that does not match this account
      const isKeyLike = inputUpper.startsWith("REC-") || inputNorm.length >= 16;
      if (isKeyLike && typeof window !== "undefined") {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith("notes_vault_") && k.endsWith("_key") && k !== getVaultKey("key")) {
            const otherKey = (localStorage.getItem(k) || "").trim().toUpperCase();
            const otherNorm = otherKey.replace(/[^A-Z0-9]/g, "");
            if (otherKey && (inputUpper === otherKey || (inputNorm.length >= 12 && inputNorm === otherNorm))) {
              return {
                success: false,
                error: "This recovery key belongs to another user account on this device. Please use your own downloaded recovery key.",
              };
            }
          }
        }
        return {
          success: false,
          error: "Invalid recovery key for this account. Please verify your downloaded recovery file.",
        };
      }

      return {
        success: false,
        error: "Incorrect master password. Please try again.",
      };
    },
    [getVaultKey]
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

    // Preserve the old credentials under frozen storage so legitimate owner can recover later
    const oldPwd = localStorage.getItem(getVaultKey("pwd"));
    const oldKey = localStorage.getItem(getVaultKey("key"));
    if (oldPwd) localStorage.setItem(getVaultKey("frozen_pwd"), oldPwd);
    if (oldKey) localStorage.setItem(getVaultKey("frozen_key"), oldKey);

    // Clear active vault configuration for this user
    localStorage.removeItem(getVaultKey("enabled"));
    localStorage.removeItem(getVaultKey("locked"));
    localStorage.removeItem(getVaultKey("pwd"));
    localStorage.removeItem(getVaultKey("key"));

    setVaultEnabled(false);
    setVaultLocked(false);
    setShowResetModal(false);
    setShowLockedModal(false);

    // Open fresh vault setup modal
    setShowSetupModal(true);
  }, [notes, updateNote, getVaultKey]);

  // Restores frozen notes back into active Personal vault when correct old password/key is entered
  const handleRestoreFrozenVault = useCallback((passwordOrKey: string): boolean | { success: boolean; error?: string } => {
    const storedFrozenPwd = localStorage.getItem(getVaultKey("frozen_pwd"));
    const storedFrozenKey = localStorage.getItem(getVaultKey("frozen_key"));
    const activePwd = localStorage.getItem(getVaultKey("pwd"));
    const activeKey = localStorage.getItem(getVaultKey("key"));

    const inputClean = passwordOrKey.trim();
    const inputUpper = inputClean.toUpperCase();
    const inputNorm = inputUpper.replace(/[^A-Z0-9]/g, "");

    const keyMatches = (stored: string | null) => {
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
            k !== getVaultKey("key") &&
            k !== getVaultKey("frozen_key")
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

    localStorage.removeItem(getVaultKey("frozen_pwd"));
    localStorage.removeItem(getVaultKey("frozen_key"));
    return true;
  }, [notes, updateNote, getVaultKey]);

  const handleSelectNotebook = useCallback((notebook: string) => {
    setActiveFilter(`notebook:${notebook}`);
    setSelectedNoteId(null);
    if (notebook === "Personal" && vaultEnabled && vaultLocked) {
      setShowLockedModal(true);
    }
  }, [vaultEnabled, vaultLocked]);

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
      {/* Left sidebar */}
      <NotesSidebar
        notes={notes}
        activeFilter={activeFilter}
        onFilterChange={(f) => { setActiveFilter(f); setSelectedNoteId(null); }}
        onSelectNotebook={handleSelectNotebook}
        vaultEnabled={vaultEnabled}
        vaultLocked={vaultLocked}
        onSetupVault={() => setShowSetupModal(true)}
        onLockVault={handleLockVault}
        onUnlockVault={() => setShowLockedModal(true)}
        onRestoreFrozenVault={() => setShowRestoreModal(true)}
      />

      {/* Middle list */}
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
      />

      {/* Right editor */}
      <NotesEditor
        note={selectedNote}
        allNotes={notes.filter((n) =>
          activeFilter === "notebook:Personal"
            ? n.notebook === "Personal"
            : n.notebook !== "Personal" && !n.isLocked && n.notebook !== "Frozen Vault"
        )}
        onSelectNote={setSelectedNoteId}
        isLocked={isPersonalLocked}
        vaultEnabled={vaultEnabled}
        vaultLocked={vaultLocked}
        onSetupVault={() => setShowSetupModal(true)}
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
          onClose={() => setShowSetupModal(false)}
          onEnable={handleEnableVault}
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
