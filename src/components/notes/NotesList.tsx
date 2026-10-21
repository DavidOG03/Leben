"use client";

import { useState } from "react";
import type { Note } from "./NotesLayout";
import {
  SearchIcon,
  SmallPlusIcon,
  ViewGridIcon,
  ViewListIcon,
  EmptyNotesIcon,
  PinIcon,
  LockIcon,
  FolderIcon,
  RefreshIcon,
} from "@/constants/Icons";
import { useLebenStore } from "@/store/useStore";

import { tagColor } from "@/utils/notes.editor.utils";

function cleanPreviewText(text: string): string {
  if (!text) return "";
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

interface Props {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  activeFilter: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCreateNote: () => void;
  onRestoreNote: (id: string) => void;
  relativeTime: (iso: string) => string;
  notePreview: (content: string) => string;
  vaultLocked: boolean;
  onOpenSidebar?: () => void;
}

export default function NotesList({
  notes,
  selectedNoteId,
  onSelectNote,
  activeFilter,
  searchQuery,
  onSearchChange,
  onCreateNote,
  onRestoreNote,
  relativeTime,
  notePreview,
  vaultLocked,
  onOpenSidebar,
}: Props) {
  // Default view is list view
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const toggleSidebar = useLebenStore((s: any) => s.toggleSidebar);

  const filterLabel =
    activeFilter === "trash"
      ? "Trash"
      : activeFilter === "archived"
        ? "Archived"
        : activeFilter === "pinned"
          ? "Pinned"
          : activeFilter === "recent"
            ? "Recent"
            : activeFilter === "notebook:Personal"
              ? "Personal"
              : activeFilter.startsWith("notebook:")
                ? activeFilter.replace("notebook:", "")
                : activeFilter.startsWith("tag:")
                  ? `#${activeFilter.replace("tag:", "")}`
                  : "All Notes";

  return (
    <div
      className={`flex flex-col flex-shrink-0 h-full overflow-hidden transition-all duration-200 ${
        selectedNoteId ? "hidden md:flex" : "flex"
      } w-full md:w-[300px]`}
      style={{
        borderRight: "1px solid #222222",
        backgroundColor: "#0a0a0a",
      }}
    >
      {/* Search + New */}
      <div className="px-4 pt-3 md:pt-4 pb-3 space-y-2.5">
        {/* Mobile Header Bar (Hidden on desktop) */}
        <div className="flex md:hidden items-center justify-between pb-2 border-b border-[#222222]">
          <div className="flex items-center gap-2">
            {/* Main App Sidebar Toggle */}
            <button
              onClick={() => toggleSidebar(true)}
              className="p-1.5 rounded-lg text-[#888888] hover:text-white hover:bg-white/5 transition-colors"
              title="Open app menu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Folder / Vault Drawer Trigger */}
            {onOpenSidebar && (
              <button
                onClick={onOpenSidebar}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                style={{
                  backgroundColor: "#161616",
                  border: "1px solid #222222",
                  color:
                    activeFilter === "notebook:Personal" ? "#7c6af0" : "#f0f0f0",
                }}
                title="Switch folder or vault"
              >
                {activeFilter === "notebook:Personal" ? (
                  <LockIcon width="11" height="11" />
                ) : (
                  <FolderIcon />
                )}
                <span className="truncate max-w-[110px]">{filterLabel}</span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            )}
          </div>

          <span
            className="text-[10px] font-semibold tracking-wider"
            style={{ color: "#555555", letterSpacing: "0.1em" }}
          >
            NOTES
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 flex-1 px-3 rounded-xl"
            style={{
              backgroundColor: "#111111",
              border: "1px solid #222222",
              height: "34px",
            }}
          >
            <SearchIcon width="13" height="13" stroke="#888888" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search notes or tags..."
              className="flex-1 bg-transparent outline-none"
              style={{ fontSize: "12px", color: "#f0f0f0" }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                style={{ color: "#888888", lineHeight: 1 }}
              >
                ×
              </button>
            )}
          </div>
          <button
            onClick={onCreateNote}
            className="flex items-center gap-1.5 px-3 rounded-xl font-medium transition-opacity hover:opacity-90 flex-shrink-0"
            style={{
              height: "34px",
              backgroundColor: "#7c6af0",
              color: "white",
              fontSize: "12px",
            }}
          >
            <SmallPlusIcon />
            New
          </button>
        </div>

        {/* Sort + View Mode Toggles */}
        <div className="flex items-center justify-between">
          <span style={{ fontSize: "11px", color: "#555" }}>
            {activeFilter === "trash"
              ? "Trash"
              : activeFilter === "archived"
                ? "Archived"
                : activeFilter === "pinned"
                  ? "Pinned"
                  : activeFilter === "recent"
                    ? "Recent"
                    : activeFilter === "notebook:Personal"
                      ? "Personal"
                      : activeFilter.startsWith("notebook:")
                        ? activeFilter.replace("notebook:", "")
                        : activeFilter.startsWith("tag:")
                          ? `#${activeFilter.replace("tag:", "")}`
                          : "All Notes"}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className="flex items-center justify-center rounded transition-colors hover:bg-white/5"
              style={{
                width: "26px",
                height: "26px",
                color: viewMode === "grid" ? "#7c6af0" : "#444",
                backgroundColor:
                  viewMode === "grid"
                    ? "rgba(124,106,240,0.12)"
                    : "transparent",
              }}
              title="Grid view (2 per row)"
              aria-label="Grid view"
            >
              <ViewGridIcon />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className="flex items-center justify-center rounded transition-colors hover:bg-white/5"
              style={{
                width: "26px",
                height: "26px",
                color: viewMode === "list" ? "#7c6af0" : "#444",
                backgroundColor:
                  viewMode === "list"
                    ? "rgba(124,106,240,0.12)"
                    : "transparent",
              }}
              title="List view"
              aria-label="List view"
            >
              <ViewListIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Note cards container */}
      <div
        className={`flex-1 overflow-y-auto px-3 pb-4 ${
          viewMode === "grid"
            ? "grid grid-cols-2 gap-2 content-start"
            : "space-y-1"
        }`}
      >
        {activeFilter === "notebook:Personal" && vaultLocked ? (
          <div
            className={`flex flex-col items-center justify-center py-16 px-4 text-center ${
              viewMode === "grid" ? "col-span-2" : ""
            }`}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,106,240,0.22), rgba(124,106,240,0.06))",
                border: "1px solid rgba(124,106,240,0.3)",
              }}
            >
              <LockIcon width="20" height="20" stroke="#7c6af0" />
            </div>
            <p className="font-semibold text-white text-[13px] mb-1">
              Personal Vault is Locked
            </p>
            <p className="text-[11px] text-[#888888] mb-4 max-w-[200px] leading-relaxed">
              Unlock your vault to access your personal notes.
            </p>
            <button
              onClick={() => onSelectNote("vault_locked_trigger")}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-90 cursor-pointer"
              style={{
                backgroundColor: "#7c6af0",
                color: "#ffffff",
                boxShadow: "0 2px 10px rgba(124,106,240,0.25)",
              }}
            >
              Unlock Vault
            </button>
          </div>
        ) : notes.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center h-48 gap-3 ${
              viewMode === "grid" ? "col-span-2" : ""
            }`}
            style={{ color: "#333" }}
          >
            <EmptyNotesIcon />
            <div className="text-center">
              <p style={{ fontSize: "12px", color: "#444" }}>
                {activeFilter === "trash"
                  ? "Trash is empty"
                  : activeFilter === "notebook:Personal"
                    ? "No personal notes yet"
                    : "No notes yet"}
              </p>
              {activeFilter !== "trash" && (
                <button
                  onClick={onCreateNote}
                  className="mt-2 transition-colors hover:opacity-80"
                  style={{ fontSize: "11px", color: "#7c6af0" }}
                >
                  Create your first note →
                </button>
              )}
            </div>
          </div>
        ) : (
          notes
            .slice()
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            )
            .map((note) => {
              const isActive = note.id === selectedNoteId;
              const isLocked = vaultLocked && note.notebook === "Personal";
              const preview = isLocked
                ? "••••••••••••••••••••••••••••••••••••"
                : cleanPreviewText(notePreview(note.content));

              if (viewMode === "grid") {
                return (
                  <div
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className="rounded-xl p-2.5 transition-all relative cursor-pointer group flex flex-col justify-between"
                    style={{
                      minHeight: "118px",
                      backgroundColor: isActive ? "#161616" : "#111111",
                      border: isActive
                        ? "1.5px solid #7c6af0"
                        : "1px solid #222222",
                      boxShadow: isActive
                        ? "0 0 12px rgba(124,106,240,0.15)"
                        : "none",
                    }}
                  >
                    {/* Top: Title + Pin/Locked indicator */}
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <p
                          className="font-semibold leading-tight line-clamp-2"
                          style={{
                            fontSize: "11.5px",
                            color: isActive ? "#f0f0f0" : "#888888",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {isLocked
                            ? "🔒 " + (note.title || "Personal Note")
                            : note.title || "Untitled note"}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0 pt-0.5">
                          {isLocked && (
                            <span
                              style={{ color: "#f06a6a" }}
                              title="Personal note locked in vault"
                            >
                              <LockIcon width="10" height="10" />
                            </span>
                          )}
                          {note.pinned && (
                            <span
                              style={{ color: "#7c6af0" }}
                              title="Pinned note"
                            >
                              <PinIcon width="10" height="10" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Preview - 2 lines/rows */}
                      {preview && (
                        <p
                          className="line-clamp-2 leading-relaxed mb-2"
                          style={{
                            fontSize: "10px",
                            color: isLocked ? "#555555" : "#888888",
                            letterSpacing: isLocked ? "0.1em" : "normal",
                          }}
                        >
                          {preview}
                        </p>
                      )}
                    </div>

                    {/* Bottom: Tag / Notebook + Timestamp or Restore */}
                    <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-[#222222] mt-auto">
                      <div className="truncate">
                        {note.tags && note.tags.length > 0 ? (
                          <span
                            className="px-1 py-0.5 rounded text-[8.5px] truncate max-w-[65px] inline-block"
                            style={{
                              backgroundColor: `${tagColor(note.tags[0])}18`,
                              color: tagColor(note.tags[0]),
                            }}
                          >
                            {note.tags[0]}
                          </span>
                        ) : note.notebook ? (
                          <span className="text-[8.5px] text-[#555] truncate max-w-[65px] inline-block">
                            {note.notebook}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex-shrink-0">
                        {note.trashed ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRestoreNote(note.id);
                            }}
                            className="flex items-center gap-0.5 text-[8.5px] text-[#7c6af0] hover:underline"
                            title="Restore note"
                          >
                            <RefreshIcon width="8" height="8" />
                            Restore
                          </button>
                        ) : (
                          <span style={{ fontSize: "8.5px", color: "#444" }}>
                            {relativeTime(note.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              // List View (default)
              return (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className="w-full text-left rounded-xl p-3 transition-colors relative cursor-pointer group"
                  style={{
                    backgroundColor: isActive ? "#161616" : "transparent",
                    border: isActive
                      ? "1px solid #7c6af0"
                      : "1px solid transparent",
                  }}
                >
                  {/* Pin or Locked indicator */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    {isLocked && (
                      <span
                        style={{ color: "#f06a6a" }}
                        title="Personal note locked in vault"
                      >
                        <LockIcon width="11" height="11" />
                      </span>
                    )}
                    {note.pinned && (
                      <span style={{ color: "#7c6af0" }} title="Pinned note">
                        <PinIcon width="11" height="11" />
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <p
                    className="font-semibold mb-1 pr-6 leading-snug flex items-center gap-1.5"
                    style={{
                      fontSize: "12px",
                      color: isActive ? "#f0f0f0" : "#888888",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {isLocked
                      ? "🔒 " + (note.title || "Personal Note")
                      : note.title || "Untitled note"}
                  </p>

                  {/* Preview */}
                  {preview && (
                    <p
                      className="mb-2 leading-relaxed"
                      style={{
                        fontSize: "11px",
                        color: isLocked ? "#555555" : "#888888",
                        letterSpacing: isLocked ? "0.1em" : "normal",
                      }}
                    >
                      {preview}
                    </p>
                  )}

                  {/* Tags + timestamp or Restore */}
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-1 flex-wrap">
                      {note.tags.slice(0, 3).map((tag) => {
                        const color = tagColor(tag);
                        return (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded"
                            style={{
                              fontSize: "9px",
                              backgroundColor: `${color}18`,
                              color,
                            }}
                          >
                            {tag}
                          </span>
                        );
                      })}
                      {note.notebook && (
                        <span
                          className="px-1.5 py-0.5 rounded text-[#555] bg-white/5"
                          style={{ fontSize: "9px" }}
                        >
                          {note.notebook}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {note.trashed ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRestoreNote(note.id);
                          }}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[#7c6af0] transition-colors"
                          style={{ fontSize: "9px" }}
                          title="Restore note from Trash"
                        >
                          <RefreshIcon width="9" height="9" />
                          Restore
                        </button>
                      ) : (
                        <span style={{ fontSize: "9px", color: "#444" }}>
                          {relativeTime(note.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
