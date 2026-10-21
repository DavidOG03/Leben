"use client";

import type { Note } from "./NotesLayout";
import {
  NoteDocIcon,
  ClockIcon,
  PinIcon,
  ArchiveIcon,
  TrashIcon,
  MoreVerticalIcon,
  FolderIcon,
  FolderPlusIcon,
  LockIcon,
} from "@/constants/Icons";

interface Props {
  notes: Note[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSelectNotebook: (notebook: string) => void;
  vaultEnabled: boolean;
  vaultLocked: boolean;
  onSetupVault: () => void;
  onLockVault: () => void;
  onUnlockVault: () => void;
  onRestoreFrozenVault?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

import { tagColor } from "@/utils/notes.editor.utils";

export default function NotesSidebar({
  notes,
  activeFilter,
  onFilterChange,
  onSelectNotebook,
  vaultEnabled,
  vaultLocked,
  onSetupVault,
  onLockVault,
  onUnlockVault,
  onRestoreFrozenVault,
  isOpen = false,
  onClose,
}: Props) {
  const active = (key: string) => activeFilter === key;

  // Accessible notes strictly exclude personal locked notes
  const accessibleNotes = notes.filter(
    (n) => n.notebook !== "Personal" && !n.isLocked && n.notebook !== "Frozen Vault"
  );
  const activeAccessibleNotes = accessibleNotes.filter((n) => !n.archived && !n.trashed);

  // Personal notes count
  const personalNotes = notes.filter(
    (n) => n.notebook === "Personal" && !n.trashed && !n.archived
  );
  const personalCount = personalNotes.length;

  const frozenNotesCount = notes.filter(
    (n) => n.notebook === "Frozen Vault" && !n.trashed
  ).length;

  const counts = {
    all: activeAccessibleNotes.length,
    recent: (() => {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      return activeAccessibleNotes.filter((n) => new Date(n.updatedAt).getTime() > cutoff)
        .length;
    })(),
    pinned: activeAccessibleNotes.filter((n) => n.pinned).length,
    archived: accessibleNotes.filter((n) => n.archived && !n.trashed).length,
    trash: accessibleNotes.filter((n) => n.trashed).length,
  };

  // Group active accessible notes by notebook (excluding Personal & Frozen Vault)
  const notebookMap: Record<string, number> = {};
  activeAccessibleNotes.forEach((n) => {
    const nb = n.notebook || "General";
    if (nb !== "Personal" && nb !== "Frozen Vault") {
      notebookMap[nb] = (notebookMap[nb] ?? 0) + 1;
    }
  });
  const otherNotebooks = Object.entries(notebookMap).sort((a, b) => b[1] - a[1]);

  // Unique tags across accessible notes
  const tagSet = new Set<string>();
  activeAccessibleNotes.forEach((n) => n.tags.forEach((t) => tagSet.add(t)));
  const tags = Array.from(tagSet);

  const filterItems = [
    {
      key: "all",
      label: "All Notes",
      count: counts.all,
      icon: <NoteDocIcon />,
    },
    {
      key: "recent",
      label: "Recent",
      count: counts.recent,
      icon: <ClockIcon />,
    },
    {
      key: "pinned",
      label: "Pinned",
      count: counts.pinned,
      icon: <PinIcon />,
    },
    {
      key: "archived",
      label: "Archived",
      count: counts.archived,
      icon: <ArchiveIcon />,
    },
    {
      key: "trash",
      label: "Trash",
      count: counts.trash,
      icon: <TrashIcon />,
    },
  ];

  const handleFilterClick = (key: string) => {
    onFilterChange(key);
    if (onClose) onClose();
  };

  const handleNotebookClick = (label: string) => {
    onSelectNotebook(label);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Drawer Backdrop (for mobile and tablet/laptop screens < 1200px) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out xl:relative xl:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-[260px] xl:w-[220px] overflow-y-auto`}
        style={{
          backgroundColor: "#0a0a0a",
          borderRight: "1px solid #222222",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #222222" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-semibold tracking-widest"
              style={{ fontSize: "10px", color: "#555555", letterSpacing: "0.12em" }}
            >
              NOTES VAULT
            </span>
          </div>

          {/* Close button on drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="flex xl:hidden items-center justify-center w-7 h-7 rounded-md text-[#888888] hover:text-white hover:bg-white/10 transition-colors"
              title="Close drawer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters (Accessible Notes) */}
        <nav className="px-2 pt-3 pb-1 space-y-px">
          {filterItems.map((f) => {
            const isActive = active(f.key);
            return (
              <button
                key={f.key}
                onClick={() => handleFilterClick(f.key)}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-left"
                style={{
                  backgroundColor: isActive ? "#1e1e1e" : "transparent",
                  color: isActive ? "#f0f0f0" : "#555",
                  fontSize: "12px",
                }}
              >
                <span style={{ color: isActive ? "#7c6af0" : "#444" }}>
                  {f.icon}
                </span>
                <span className="flex-1">{f.label}</span>
                {f.count > 0 && (
                  <span
                    style={{
                      fontSize: "10px",
                      color: isActive ? "#888" : "#333",
                    }}
                  >
                    {f.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Accessible Folders (e.g. General, etc.) */}
        {otherNotebooks.length > 0 && (
          <div className="px-2 pt-1 space-y-px">
            {otherNotebooks.map(([label, count]) => {
              const isNbActive = active(`notebook:${label}`);
              return (
                <button
                  key={label}
                  onClick={() => handleNotebookClick(label)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 text-left"
                  style={{
                    fontSize: "12px",
                    color: isNbActive ? "#f0f0f0" : "#555",
                    backgroundColor: isNbActive ? "#1e1e1e" : "transparent",
                  }}
                >
                  <FolderIcon />
                  <span className="flex-1 truncate">{label}</span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: isNbActive ? "#888888" : "#555555",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Space separating accessible notes from Personal vault tab */}
        <div className="my-3 mx-3 border-t border-[#222222]" />

        {/* Personal Tab (Locked Vault Folder) */}
        <div className="px-2 space-y-1">
          {(() => {
            const isPersonalActive = active("notebook:Personal");
            return (
              <button
                onClick={() => handleNotebookClick("Personal")}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 text-left"
              style={{
                fontSize: "12px",
                color: isPersonalActive ? "#f0f0f0" : "#888888",
                backgroundColor: isPersonalActive ? "#1e1e1e" : "transparent",
                border: isPersonalActive
                  ? "1px solid rgba(124,106,240,0.3)"
                  : "1px solid transparent",
              }}
            >
              <span
                style={{
                  color:
                    vaultEnabled && vaultLocked
                      ? "#f06a6a"
                      : vaultEnabled
                        ? "#4caf7d"
                        : "#7c6af0",
                }}
              >
                <LockIcon width="12" height="12" />
              </span>
              <span className="flex-1 truncate font-medium">Personal</span>
              {vaultEnabled && (
                <span
                  className="px-1.5 py-0.2 rounded"
                  style={{
                    fontSize: "8px",
                    backgroundColor: vaultLocked
                      ? "rgba(240, 106, 106, 0.12)"
                      : "rgba(76, 175, 125, 0.12)",
                    border: vaultLocked
                      ? "1px solid rgba(240, 106, 106, 0.25)"
                      : "1px solid rgba(76, 175, 125, 0.25)",
                    color: vaultLocked ? "#f06a6a" : "#4caf7d",
                  }}
                >
                  {vaultLocked ? "LOCKED" : "UNLOCKED"}
                </span>
              )}
              {!vaultEnabled && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetupVault();
                  }}
                  className="px-1.5 py-0.5 rounded transition-colors hover:bg-[#7c6af0]/20 cursor-pointer"
                  style={{
                    fontSize: "8px",
                    backgroundColor: "rgba(124,106,240,0.12)",
                    color: "#7c6af0",
                    border: "1px solid rgba(124,106,240,0.25)",
                  }}
                  title="Set up Vault security"
                >
                  SET UP
                </span>
              )}
              {personalCount > 0 && (
                <span
                  style={{
                    fontSize: "10px",
                    color: isPersonalActive ? "#888888" : "#555555",
                  }}
                >
                  {personalCount}
                </span>
              )}
            </button>
          );
        })()}

        {/* Frozen Vault Archive (if notes are preserved from a previous reset) */}
        {frozenNotesCount > 0 && (
          <div className="pt-1">
            <button
              onClick={onRestoreFrozenVault}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors hover:bg-white/5 text-left group"
              style={{
                fontSize: "12px",
                color: "#9d8ff5",
                backgroundColor: "rgba(124,106,240,0.08)",
                border: "1px solid rgba(124,106,240,0.22)",
              }}
            >
              <span className="flex items-center gap-2 truncate">
                <LockIcon width="12" height="12" stroke="#7c6af0" />
                <span className="truncate">Frozen Vault</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider"
                  style={{
                    backgroundColor: "rgba(124,106,240,0.2)",
                    color: "#7c6af0",
                  }}
                >
                  RESTORE
                </span>
                <span style={{ fontSize: "10px", color: "#888888" }}>
                  {frozenNotesCount}
                </span>
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="px-2 pt-4">
          <div className="flex items-center justify-between px-3 mb-2">
            <span
              className="font-semibold tracking-widest"
              style={{ fontSize: "9px", color: "#444", letterSpacing: "0.1em" }}
            >
              TAGS
            </span>
          </div>
          <div className="px-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const color = tagColor(tag);
              const isTagActive = active(`tag:${tag}`);
              return (
                <button
                  key={tag}
                  onClick={() =>
                    onFilterChange(isTagActive ? "all" : `tag:${tag}`)
                  }
                  className="px-2 py-0.5 rounded-md transition-colors hover:opacity-80"
                  style={{
                    fontSize: "10px",
                    backgroundColor: isTagActive ? color : `${color}18`,
                    color: isTagActive ? "#ffffff" : color,
                    border: isTagActive
                      ? `1px solid ${color}`
                      : "1px solid transparent",
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Vault Status / Action */}
      <div className="px-3 pb-2">
        {!vaultEnabled ? (
          <button
            onClick={onSetupVault}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ fontSize: "11px", color: "#7c6af0" }}
          >
            <LockIcon width="12" height="12" />
            Set up vault password
          </button>
        ) : vaultLocked ? (
          <button
            onClick={onUnlockVault}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
            style={{
              fontSize: "11px",
              color: "#f06a6a",
              backgroundColor: "rgba(240, 106, 106, 0.12)",
              border: "1px solid rgba(240, 106, 106, 0.25)",
            }}
          >
            <span className="flex items-center gap-2">
              <LockIcon width="12" height="12" />
              Vault Locked
            </span>
            <span style={{ fontSize: "10px", textDecoration: "underline" }}>
              Unlock
            </span>
          </button>
        ) : (
          <button
            onClick={onLockVault}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors hover:bg-white/5"
            style={{ fontSize: "11px", color: "#888888" }}
          >
            <span className="flex items-center gap-2">
              <LockIcon width="12" height="12" stroke="#4caf7d" />
              Personal Vault Open
            </span>
            <span style={{ fontSize: "10px", color: "#7c6af0" }}>Lock Now</span>
          </button>
        )}
      </div>
    </aside>
    </>
  );
}
