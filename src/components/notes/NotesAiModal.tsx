"use client";

import { useState } from "react";
import {
  SummaryIcon,
  ExtractIcon,
  ImproveIcon,
  CheckIcon,
  ConnectionIcon,
  CloseIcon,
  CopyIcon,
  PlusIcon,
  ArrowRightIcon,
  NoteDocIcon,
  FolderIcon,
} from "@/constants/Icons";

export type AiAction =
  | "summarize"
  | "extract_tasks"
  | "improve_writing"
  | "find_connections";

interface TaskItem {
  title: string;
  priority?: "high" | "medium" | "low";
  category?: string;
}

interface ConnectionItem {
  noteId: string;
  noteTitle: string;
  reason: string;
  similarityScore: number;
}

interface Props {
  action: AiAction | null;
  loading: boolean;
  data: any;
  error: string | null;
  noteTitle: string;
  onClose: () => void;
  onInsertSummary?: (tldrText: string, keyPoints: string[]) => void;
  onImportTask?: (
    title: string,
    category?: string,
    priority?: "high" | "medium" | "low",
  ) => Promise<void>;
  onImportAllTasks?: (tasks: TaskItem[]) => Promise<void>;
  onAcceptImprovement?: (
    improvedTitle: string,
    improvedContent: string,
  ) => void;
  onSelectConnectedNote?: (noteId: string) => void;
  onRetry?: () => void;
}

export default function NotesAiModal({
  action,
  loading,
  data,
  error,
  noteTitle,
  onClose,
  onInsertSummary,
  onImportTask,
  onImportAllTasks,
  onAcceptImprovement,
  onSelectConnectedNote,
  onRetry,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [inserted, setInserted] = useState(false);
  const [importedTaskTitles, setImportedTaskTitles] = useState<Set<string>>(
    new Set(),
  );
  const [importingAll, setImportingAll] = useState(false);
  const [previewTab, setPreviewTab] = useState<"improved" | "original">(
    "improved",
  );

  if (!action) return null;

  const handleCopySummary = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertSummary = (tldr: string, points: string[] = []) => {
    if (onInsertSummary) {
      onInsertSummary(tldr, points);
      setInserted(true);
      setTimeout(() => setInserted(false), 2000);
    }
  };

  const handleSingleTaskImport = async (t: TaskItem) => {
    if (!onImportTask) return;
    await onImportTask(t.title, t.category, t.priority);
    setImportedTaskTitles((prev) => new Set(prev).add(t.title));
  };

  const handleAllTasksImport = async (tasks: TaskItem[]) => {
    if (!onImportAllTasks) return;
    setImportingAll(true);
    await onImportAllTasks(tasks);
    setImportedTaskTitles(new Set(tasks.map((t) => t.title)));
    setImportingAll(false);
  };

  // ── Renderers ──────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6 pointer-events-none"
      style={{
        backgroundColor: "rgba(0,0,0,0.3)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 flex flex-col pointer-events-auto shadow-2xl relative transition-all duration-200 mt-12 md:mt-16"
        style={{
          backgroundColor: "#111111",
          border: "1px solid #222222",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.8), 0 0 25px rgba(124,106,240,0.12)",
          maxHeight: "82vh",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#222222]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="flex items-center justify-center rounded-lg flex-shrink-0"
              style={{
                width: "32px",
                height: "32px",
                background: "linear-gradient(135deg, rgba(124,106,240,0.22), rgba(124,106,240,0.06))",
                border: "1px solid rgba(124,106,240,0.3)",
              }}
            >
              {action === "summarize" && (
                <SummaryIcon width="15" height="15" color="#7c6af0" />
              )}
              {action === "extract_tasks" && (
                <ExtractIcon
                  width="15"
                  height="15"
                  color="#7c6af0"
                  style={{ color: "#7c6af0" }}
                  className="text-[#7c6af0]"
                />
              )}
              {action === "improve_writing" && (
                <ImproveIcon width="15" height="15" color="#7c6af0" />
              )}
              {action === "find_connections" && (
                <span style={{ fontSize: "14px" }}>
                  <ConnectionIcon
                    width={15}
                    height={15}
                    className="text-[#7c6af0]"
                  />
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-bold text-[#f0f0f0] text-[15px] leading-tight">
                {action === "summarize" && "AI Note Summary"}
                {action === "extract_tasks" && "Extracted Action Items"}
                {action === "improve_writing" && "Writing Improvement"}
                {action === "find_connections" && "Connected Notes & Ideas"}
              </h3>
              <p className="text-[#888888] text-[11px] truncate mt-0.5">
                {noteTitle || "Current Note"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-[#888888] hover:text-[#f0f0f0]"
            style={{ width: "28px", height: "28px" }}
            title="Close (Esc)"
          >
            <CloseIcon width="12" height="12" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {/* Loading State */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#7c6af0] border-t-transparent animate-spin" />
              <p className="text-[12px] text-[#888888]">
                {action === "summarize" && "Synthesizing executive summary…"}
                {action === "extract_tasks" &&
                  "Analyzing action items & todos…"}
                {action === "improve_writing" && "Polishing sentences & flow…"}
                {action === "find_connections" &&
                  "Cross-referencing your note library…"}
              </p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-4 rounded-xl bg-[rgba(240,106,106,0.08)] border border-[rgba(240,106,106,0.25)] text-center">
              <p className="text-[12px] text-[#f06a6a] mb-2">{error}</p>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-3 py-1.5 rounded-lg bg-[#7c6af0] text-white text-[11px] font-medium hover:opacity-90 transition-opacity"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {/* 1. SUMMARIZE VIEW */}
          {!loading && !error && action === "summarize" && data && (
            <div className="space-y-4">
              {/* TL;DR card */}
              <div
                className="p-3.5 rounded-xl border-l-2 border-[#7c6af0]"
                style={{ backgroundColor: "#161616", borderTop: "1px solid #222222", borderRight: "1px solid #222222", borderBottom: "1px solid #222222" }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-[10px] font-bold text-[#7c6af0] tracking-wider uppercase">
                    Executive TL;DR
                  </span>
                </div>
                <p className="text-[12.5px] text-[#f0f0f0] leading-relaxed">
                  {data.tldr}
                </p>
              </div>

              {/* Key points */}
              {data.keyPoints && data.keyPoints.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold text-[#888888] tracking-wider uppercase mb-2">
                    Key Takeaways
                  </h4>
                  <ul className="space-y-2">
                    {data.keyPoints.map((point: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-[12px] text-[#f0f0f0]"
                      >
                        <span className="text-[#7c6af0] font-bold leading-tight mt-0.5">
                          •
                        </span>
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compression stats */}
              {data.originalWords && (
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: "#161616",
                    border: "1px solid #222222",
                  }}
                >
                  <span className="text-[10.5px] text-[#888888]">
                    Original: {data.originalWords} words
                  </span>
                  <span className="text-[10.5px] text-[#4caf7d]">
                    Condensed to{" "}
                    {data.summaryWords || Math.round(data.originalWords * 0.25)}{" "}
                    words
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 2. EXTRACT TASKS VIEW */}
          {!loading && !error && action === "extract_tasks" && data && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#888888]">
                  {data.tasks?.length || 0} action items found
                </span>
                {data.tasks && data.tasks.length > 1 && (
                  <button
                    onClick={() => handleAllTasksImport(data.tasks)}
                    disabled={importingAll}
                    className="text-[11px] text-[#7c6af0] hover:underline font-medium"
                  >
                    {importingAll ? "Importing…" : "Import All to Tasks →"}
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {(data.tasks || []).map((task: TaskItem, idx: number) => {
                  const isImported = importedTaskTitles.has(task.title);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl transition-all"
                      style={{
                        backgroundColor: "#161616",
                        border: isImported
                          ? "1px solid rgba(76,175,125,0.4)"
                          : "1px solid #222222",
                      }}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className="w-4 h-4 rounded mt-0.5 flex-shrink-0 flex items-center justify-center"
                          style={{
                            border: isImported
                              ? "1.5px solid #4caf7d"
                              : "1.5px solid #555555",
                            backgroundColor: isImported
                              ? "#4caf7d"
                              : "transparent",
                          }}
                        >
                          {isImported && (
                            <CheckIcon
                              width="8"
                              height="8"
                              className="text-black"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-[12px] font-medium leading-snug"
                            style={{
                              color: isImported ? "#888888" : "#f0f0f0",
                              textDecoration: isImported
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {task.priority && (
                              <span
                                className="px-1.5 py-0.2 rounded text-[9px] uppercase font-semibold"
                                style={{
                                  backgroundColor:
                                    task.priority === "high"
                                      ? "rgba(240,106,106,0.15)"
                                      : task.priority === "medium"
                                        ? "rgba(240,164,79,0.15)"
                                        : "rgba(124,106,240,0.15)",
                                  color:
                                    task.priority === "high"
                                      ? "#f06a6a"
                                      : task.priority === "medium"
                                        ? "#f0a44f"
                                        : "#9d8ff5",
                                }}
                              >
                                {task.priority}
                              </span>
                            )}
                            {task.category && (
                              <span className="text-[9px] text-[#555555]">
                                {task.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSingleTaskImport(task)}
                        disabled={isImported}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium flex-shrink-0 transition-all"
                        style={{
                          backgroundColor: isImported
                            ? "transparent"
                            : "#7c6af0",
                          color: isImported ? "#4caf7d" : "#ffffff",
                          cursor: isImported ? "default" : "pointer",
                        }}
                      >
                        {isImported ? (
                          <>
                            <CheckIcon width="10" height="10" />
                            Added
                          </>
                        ) : (
                          <>
                            <PlusIcon width="10" height="10" />
                            Import
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. IMPROVE WRITING VIEW */}
          {!loading && !error && action === "improve_writing" && data && (
            <div className="space-y-3">
              {/* Revision highlights */}
              {data.changesSummary && data.changesSummary.length > 0 && (
                <div
                  className="p-3 rounded-xl space-y-1"
                  style={{
                    backgroundColor: "#161616",
                    border: "1px solid #222222",
                  }}
                >
                  <p className="text-[10px] font-bold text-[#7c6af0] uppercase tracking-wider mb-1">
                    What was improved:
                  </p>
                  {data.changesSummary.map((change: string, idx: number) => (
                    <p
                      key={idx}
                      className="text-[11px] text-[#888888] flex items-center gap-1.5"
                    >
                      <span className="text-[#4caf7d] text-[10px]">✓</span>{" "}
                      {change}
                    </p>
                  ))}
                </div>
              )}

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-2 border-b border-[#222222] pb-1">
                <button
                  onClick={() => setPreviewTab("improved")}
                  className="px-2.5 py-1 text-[11px] font-medium transition-colors"
                  style={{
                    color: previewTab === "improved" ? "#f0f0f0" : "#888888",
                    borderBottom:
                      previewTab === "improved" ? "2px solid #7c6af0" : "none",
                  }}
                >
                  Suggested Revision
                </button>
                <button
                  onClick={() => setPreviewTab("original")}
                  className="px-2.5 py-1 text-[11px] font-medium transition-colors"
                  style={{
                    color: previewTab === "original" ? "#f0f0f0" : "#888888",
                    borderBottom:
                      previewTab === "original" ? "2px solid #7c6af0" : "none",
                  }}
                >
                  Original
                </button>
              </div>

              {/* Preview Box */}
              <div
                className="p-3.5 rounded-xl text-[12px] leading-relaxed overflow-y-auto"
                style={{
                  backgroundColor: "#0a0a0a",
                  border: "1px solid #222222",
                  maxHeight: "220px",
                  color: "#f0f0f0",
                }}
              >
                {previewTab === "improved" ? (
                  <div>
                    {data.improvedTitle && (
                      <h4 className="font-bold text-[#f0f0f0] text-[14px] mb-2">
                        {data.improvedTitle}
                      </h4>
                    )}
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.improvedContent || "",
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <h4 className="font-bold text-[#f0f0f0] text-[14px] mb-2">
                      {noteTitle}
                    </h4>
                    <p className="text-[#888888] italic">
                      Original note content as currently written.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. FIND CONNECTIONS VIEW */}
          {!loading && !error && action === "find_connections" && data && (
            <div className="space-y-3">
              {(data.connections || []).length === 0 ? (
                <div className="py-8 text-center text-[#888888]">
                  <NoteDocIcon
                    width="32"
                    height="32"
                    className="mx-auto mb-2 opacity-30"
                  />
                  <p className="text-[12px] text-[#888888]">
                    No other connected notes found yet
                  </p>
                  <p className="text-[11px] text-[#555555] max-w-xs mx-auto mt-1">
                    As you add more notes with shared tags (#Work, #Ideas) or
                    notebooks, Leben will automatically highlight connected
                    ideas here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {data.connections.map((conn: ConnectionItem, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl transition-all flex flex-col justify-between gap-2"
                      style={{
                        backgroundColor: "#161616",
                        border: "1px solid #222222",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <FolderIcon
                            width="12"
                            height="12"
                            className="text-[#7c6af0] flex-shrink-0"
                          />
                          <h4 className="font-semibold text-[#f0f0f0] text-[12.5px] truncate">
                            {conn.noteTitle}
                          </h4>
                        </div>
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider"
                          style={{
                            backgroundColor: "rgba(124,106,240,0.15)",
                            color: "#7c6af0",
                          }}
                        >
                          {conn.similarityScore}% LINK
                        </span>
                      </div>

                      <p className="text-[11px] text-[#888888] leading-relaxed">
                        {conn.reason}
                      </p>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => {
                            if (onSelectConnectedNote) {
                              onSelectConnectedNote(conn.noteId);
                              onClose();
                            }
                          }}
                          className="flex items-center gap-1 text-[11px] text-[#7c6af0] hover:text-[#9d8ff5] font-medium transition-colors"
                        >
                          Open Note <ArrowRightIcon width="10" height="10" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Footer */}
        {!loading && !error && (
          <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#222222] gap-2">
            {/* Summarize actions */}
            {action === "summarize" && data && (
              <>
                <button
                  onClick={() =>
                    handleCopySummary(
                      `${data.tldr}\n\nKey Takeaways:\n${(data.keyPoints || []).map((p: string) => `- ${p}`).join("\n")}`,
                    )
                  }
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-colors border border-[#222222] hover:bg-white/5 text-[#888888] hover:text-[#f0f0f0]"
                >
                  <CopyIcon width="12" height="12" />
                  {copied ? "Copied!" : "Copy Summary"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleInsertSummary(data.tldr, data.keyPoints)
                    }
                    disabled={inserted}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: inserted ? "#4caf7d" : "#7c6af0",
                    }}
                  >
                    <PlusIcon width="12" height="12" />
                    {inserted ? "Inserted ✓" : "Insert into Note"}
                  </button>
                </div>
              </>
            )}

            {/* Extract Tasks actions */}
            {action === "extract_tasks" && (
              <>
                <span className="text-[11px] text-[#888888]">
                  Tasks import directly to your Leben Tasks page
                </span>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-[12px] font-medium bg-[#161616] border border-[#222222] hover:bg-[#1c1c1c] text-[#f0f0f0] transition-colors"
                >
                  Done
                </button>
              </>
            )}

            {/* Improve Writing actions (Accept / Reject) */}
            {action === "improve_writing" && data && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-[12px] font-medium border border-[#222222] hover:bg-white/5 text-[#888888] transition-colors"
                >
                  ✕ Reject
                </button>

                <button
                  onClick={() => {
                    if (onAcceptImprovement) {
                      onAcceptImprovement(
                        data.improvedTitle || noteTitle,
                        data.improvedContent,
                      );
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "#7c6af0" }}
                >
                  <CheckIcon width="12" height="12" />
                  Accept &amp; Replace Note
                </button>
              </>
            )}

            {/* Find Connections actions */}
            {action === "find_connections" && (
              <>
                <span className="text-[11px] text-[#888888]">
                  Click &ldquo;Open Note&rdquo; to jump directly to any related
                  note
                </span>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-[12px] font-medium bg-[#161616] border border-[#222222] hover:bg-[#1c1c1c] text-[#f0f0f0] transition-colors"
                >
                  Close
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
