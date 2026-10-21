"use client";

import React from "react";
import type { EditorHeaderProps } from "@/utils/notes.editor.types";
import { tagColor } from "@/utils/notes.editor.utils";
import {
  LockIcon,
  ArchiveIcon,
  PinIcon,
  TrashIcon,
} from "@/constants/Icons";

export default function EditorHeader({
  note,
  title,
  isPersonal,
  vaultEnabled,
  onBackToList,
  showTagInput,
  newTagInput,
  setNewTagInput,
  setShowTagInput,
  onAddTag,
  onRemoveTag,
  onToggleVault,
  onTogglePin,
  onArchive,
  onDelete,
  onUpdateNotebook,
}: EditorHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-3 md:px-6 py-2.5 flex-shrink-0 gap-2 md:gap-3"
      style={{ borderBottom: "1px solid #222222" }}
    >
      {/* Breadcrumb + Mobile Back Button */}
      <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
        {onBackToList && (
          <button
            onClick={onBackToList}
            className="flex md:hidden items-center gap-1 px-2 py-1 -ml-1 rounded-lg text-[#888888] hover:text-[#f0f0f0] hover:bg-white/5 transition-colors flex-shrink-0"
            title="Back to notes list"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span style={{ fontSize: "11px", fontWeight: 500 }}>Notes</span>
          </button>
        )}

        <button
          onClick={() => {
            const nextNb = window.prompt(
              "Set notebook name (e.g. General, Personal, Work, Ideas):",
              note.notebook || "General",
            );
            if (nextNb && nextNb.trim()) {
              onUpdateNotebook(nextNb.trim());
            }
          }}
          className="flex items-center gap-1 hover:underline transition-all truncate"
          style={{
            fontSize: "12px",
            color: isPersonal ? "#7c6af0" : "#888888",
          }}
          title="Click to move to another notebook"
        >
          {isPersonal && <LockIcon width="10" height="10" />}
          <span className="truncate max-w-[80px] sm:max-w-none">{note.notebook || "General"}</span>
        </button>
        <span style={{ fontSize: "12px", color: "#555555" }}>/</span>
        <span
          className="truncate"
          style={{ fontSize: "12px", color: "#888888", maxWidth: "120px" }}
        >
          {title || "Untitled note"}
        </span>
        {isPersonal && (
          <span
            className="px-1.5 py-0.5 rounded flex items-center gap-1 ml-0.5 flex-shrink-0"
            style={{
              fontSize: "9px",
              backgroundColor: "rgba(124,106,240,0.12)",
              color: "#7c6af0",
              border: "1px solid rgba(124,106,240,0.25)",
            }}
          >
            <LockIcon width="8" height="8" />
            Vault
          </span>
        )}
      </div>

      {/* Tags + actions */}
      <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
        {note.tags.map((tag) => {
          const color = tagColor(tag);
          return (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md"
              style={{
                fontSize: "10px",
                backgroundColor: `${color}18`,
                color,
              }}
            >
              {tag}
              <button
                onClick={() => onRemoveTag(tag)}
                style={{ color: "inherit", opacity: 0.6, lineHeight: 1 }}
              >
                ×
              </button>
            </span>
          );
        })}

        {/* Add tag */}
        {showTagInput ? (
          <input
            autoFocus
            value={newTagInput}
            onChange={(e) => setNewTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onAddTag();
              if (e.key === "Escape") {
                setShowTagInput(false);
                setNewTagInput("");
              }
            }}
            onBlur={onAddTag}
            placeholder="#tag"
            className="bg-transparent outline-none border rounded-md px-2"
            style={{
              fontSize: "10px",
              color: "#888888",
              borderColor: "#222222",
              height: "20px",
              width: "60px",
            }}
          />
        ) : (
          <button
            onClick={() => setShowTagInput(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/5 transition-colors"
            style={{ fontSize: "10px", color: "#555555" }}
          >
            + tag
          </button>
        )}

        {/* Vault Lock button */}
        <button
          onClick={onToggleVault}
          title={
            isPersonal
              ? "In Personal Vault (Click to unlock / remove from Vault)"
              : vaultEnabled
                ? "Add note to Personal locked Vault"
                : "Set up Vault and lock this note"
          }
          className="flex items-center justify-center rounded hover:bg-white/5 transition-colors"
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: isPersonal
              ? "rgba(124,106,240,0.18)"
              : "transparent",
            color: isPersonal ? "#7c6af0" : "#555555",
          }}
        >
          <LockIcon width="12" height="12" />
        </button>

        {/* Archive button */}
        <button
          onClick={() => onArchive(note.id, !note.archived)}
          title={note.archived ? "Unarchive note" : "Archive note"}
          className="flex items-center justify-center rounded hover:bg-white/5 transition-colors"
          style={{
            width: "24px",
            height: "24px",
            color: note.archived ? "#7c6af0" : "#555555",
          }}
        >
          <ArchiveIcon width="12" height="12" />
        </button>

        {/* Pin button */}
        <button
          onClick={onTogglePin}
          title={note.pinned ? "Unpin note" : "Pin note"}
          className="flex items-center justify-center rounded hover:bg-white/5 transition-colors"
          style={{
            width: "24px",
            height: "24px",
            color: note.pinned ? "#7c6af0" : "#555555",
          }}
        >
          <PinIcon width="12" height="12" />
        </button>

        {/* Delete button */}
        <button
          onClick={() => onDelete(note.id)}
          title={note.trashed ? "Delete permanently" : "Move to trash"}
          className="flex items-center justify-center rounded hover:bg-red-500/10 transition-colors"
          style={{
            width: "24px",
            height: "24px",
            color: note.trashed ? "#f06a6a" : "#888888",
          }}
        >
          <TrashIcon width="12" height="12" />
        </button>
      </div>
    </div>
  );
}
