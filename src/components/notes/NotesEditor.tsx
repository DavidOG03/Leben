"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { NotesEditorProps, SaveState } from "@/utils/notes.editor.types";
import { markdownToHtml, EDITOR_SURFACE_CSS } from "@/utils/notes.editor.utils";
import EditorEmptyState from "./editor/EditorEmptyState";
import EditorLockedState from "./editor/EditorLockedState";
import EditorHeader from "./editor/EditorHeader";
import EditorToolbar from "./editor/EditorToolbar";
import EditorStatusBar from "./editor/EditorStatusBar";
import { useEditorCommands } from "./editor/useEditorCommands";
import { useNotesAi } from "./editor/useNotesAi";
import NotesAiAssistPanel from "./NotesAiAssistPanel";
import NotesAiModal from "./NotesAiModal";
import { RefreshIcon } from "@/constants/Icons";

export default function NotesEditor({
  note,
  allNotes,
  onSelectNote,
  isLocked = false,
  vaultEnabled = false,
  onSetupVault,
  onUnlockRequest,
  onUpdate,
  onDelete,
  onArchive,
  onRestore,
  relativeTime,
}: NotesEditorProps) {
  const [title, setTitle] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [wordCount, setWordCount] = useState(0);
  const [newTagInput, setNewTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const latestTitle = useRef(title);
  latestTitle.current = title;

  // Debounced save
  const scheduleSave = useCallback(
    (newTitle: string, newHtml: string) => {
      if (!note) return;
      setSaveState("unsaved");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        setSaveState("saving");
        onUpdate(note.id, { title: newTitle, content: newHtml });
        setSaveState("saved");
      }, 600);
    },
    [note, onUpdate],
  );

  const handleInput = useCallback(() => {
    if (!editorRef.current || !note) return;
    const html = editorRef.current.innerHTML;
    const text = editorRef.current.innerText || "";
    const words = text.split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    scheduleSave(latestTitle.current, html);
  }, [note, scheduleSave]);

  // Editor DOM commands and selection handlers
  const {
    activeFormats,
    updateActiveFormats,
    executeCommand,
    insertCode,
    insertCheckbox,
    handleKeyDown,
    handleEditorClick,
    handlePaste,
  } = useEditorCommands({
    editorRef,
    onInput: handleInput,
  });

  // AI assist actions & workflow
  const {
    aiAction,
    aiLoading,
    aiData,
    aiError,
    handleTriggerAi,
    handleInsertSummary,
    handleImportTask,
    handleImportAllTasks,
    handleAcceptImprovement,
    handleCloseAiModal,
  } = useNotesAi({
    note,
    allNotes,
    editorRef,
    title,
    setTitle,
    latestTitle,
    onUpdate,
    setSaveState,
  });

  // Sync state when selected note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      latestTitle.current = note.title;
      const initialHtml = markdownToHtml(note.content || "");
      if (editorRef.current) {
        editorRef.current.innerHTML = initialHtml;
        const text = editorRef.current.innerText || "";
        setWordCount(text.split(/\s+/).filter(Boolean).length);
      }
      setSaveState("saved");
    }
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-grow title height
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = titleRef.current.scrollHeight + "px";
    }
  }, [title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.replace(/\n/g, "");
    setTitle(val);
    latestTitle.current = val;
    scheduleSave(val, editorRef.current?.innerHTML || "");
  };

  // Flush pending save immediately when tab closes
  useEffect(() => {
    if (!note) return;
    const flush = () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        const currentHtml = editorRef.current?.innerHTML || "";
        onUpdate(note.id, { title: latestTitle.current, content: currentHtml });
      }
    };
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, [note?.id, onUpdate]);

  // Ctrl+S / Cmd+S manual save shortcut
  useEffect(() => {
    if (!note) return;
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (saveTimer.current) clearTimeout(saveTimer.current);
        const currentHtml = editorRef.current?.innerHTML || "";
        onUpdate(note.id, { title: latestTitle.current, content: currentHtml });
        setSaveState("saved");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [note?.id, onUpdate]);

  // Tag management
  const handleAddTag = () => {
    if (!note || !newTagInput.trim()) return;
    const tag = newTagInput.trim().startsWith("#")
      ? newTagInput.trim()
      : `#${newTagInput.trim()}`;
    if (note.tags.includes(tag)) {
      setNewTagInput("");
      setShowTagInput(false);
      return;
    }
    onUpdate(note.id, { tags: [...note.tags, tag] });
    setNewTagInput("");
    setShowTagInput(false);
  };

  const handleRemoveTag = (tag: string) => {
    if (!note) return;
    onUpdate(note.id, { tags: note.tags.filter((t) => t !== tag) });
  };

  const handleTogglePin = () => {
    if (!note) return;
    onUpdate(note.id, { pinned: !note.pinned });
  };

  const isPersonal = note?.notebook === "Personal";

  const handleToggleVault = () => {
    if (!note) return;
    if (isPersonal) {
      onUpdate(note.id, { notebook: "General" });
    } else {
      if (!vaultEnabled && onSetupVault) {
        onSetupVault();
      }
      onUpdate(note.id, { notebook: "Personal" });
    }
  };

  if (!note) {
    return <EditorEmptyState />;
  }

  if (isLocked) {
    return <EditorLockedState onUnlockRequest={onUnlockRequest} />;
  }

  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div
      className="flex flex-1 h-full overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Editor CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: EDITOR_SURFACE_CSS }} />

      {/* Main editor column */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Trashed Alert Banner */}
        {note.trashed && (
          <div className="flex items-center justify-between px-6 py-2.5 bg-[rgba(240,106,106,0.08)] border-b border-[rgba(240,106,106,0.25)] flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[#f06a6a]">⚠️</span>
              <span style={{ fontSize: "12px", color: "#f06a6a" }}>
                This note is in Trash.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRestore(note.id)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                style={{ fontSize: "11px", backgroundColor: "#7c6af0" }}
              >
                <RefreshIcon width="11" height="11" />
                Restore Note
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="px-3 py-1 rounded-lg text-[#f06a6a] hover:bg-red-500/10 transition-colors"
                style={{ fontSize: "11px" }}
              >
                Delete Forever
              </button>
            </div>
          </div>
        )}

        {/* Top bar: breadcrumb + tags + actions */}
        <EditorHeader
          note={note}
          title={title}
          isPersonal={isPersonal}
          vaultEnabled={vaultEnabled}
          showTagInput={showTagInput}
          newTagInput={newTagInput}
          setNewTagInput={setNewTagInput}
          setShowTagInput={setShowTagInput}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onToggleVault={handleToggleVault}
          onTogglePin={handleTogglePin}
          onArchive={onArchive}
          onDelete={onDelete}
          onUpdateNotebook={(nextNb) => onUpdate(note.id, { notebook: nextNb })}
        />

        {/* Toolbar */}
        <EditorToolbar
          activeFormats={activeFormats}
          onExecuteCommand={executeCommand}
          onInsertCode={insertCode}
          onInsertCheckbox={insertCheckbox}
        />

        {/* Editable visual document area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <textarea
            ref={titleRef}
            value={title}
            onChange={handleTitleChange}
            placeholder="Note title"
            rows={1}
            className="w-full bg-transparent outline-none resize-none font-black text-white mb-5 leading-tight"
            style={{
              fontSize: "32px",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              caretColor: "#7c6af0",
              overflow: "hidden",
            }}
          />

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onClick={handleEditorClick}
            onKeyDown={handleKeyDown}
            onKeyUp={updateActiveFormats}
            onMouseUp={updateActiveFormats}
            onPaste={handlePaste}
            data-placeholder="Start writing... Type or use toolbar above to format."
            className="notes-editor-surface w-full outline-none"
            style={{
              fontSize: "14px",
              color: "#ccc",
              lineHeight: 1.8,
              caretColor: "#7c6af0",
              minHeight: "360px",
            }}
          />
        </div>

        {/* Bottom status bar */}
        <EditorStatusBar
          saveState={saveState}
          wordCount={wordCount}
          readTime={readTime}
          updatedAt={note.updatedAt}
          relativeTime={relativeTime}
        />
      </div>

      {/* AI assist panel */}
      <NotesAiAssistPanel
        wordCount={wordCount}
        readTime={readTime}
        updatedAt={note.updatedAt}
        relativeTime={relativeTime}
        aiAction={aiAction}
        aiLoading={aiLoading}
        onTriggerAi={handleTriggerAi}
      />

      {/* AI Action Modal / Overlay */}
      {aiAction && (
        <NotesAiModal
          action={aiAction}
          loading={aiLoading}
          data={aiData}
          error={aiError}
          noteTitle={title || note.title}
          onClose={handleCloseAiModal}
          onInsertSummary={handleInsertSummary}
          onImportTask={handleImportTask}
          onImportAllTasks={handleImportAllTasks}
          onAcceptImprovement={handleAcceptImprovement}
          onSelectConnectedNote={onSelectNote}
          onRetry={() => aiAction && handleTriggerAi(aiAction)}
        />
      )}
    </div>
  );
}
