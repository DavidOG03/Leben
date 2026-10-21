"use client";

import { useState, useCallback } from "react";
import type { ActiveFormats } from "@/utils/notes.editor.types";

interface UseEditorCommandsProps {
  editorRef: React.RefObject<HTMLDivElement>;
  onInput: () => void;
}

export function useEditorCommands({
  editorRef,
  onInput,
}: UseEditorCommandsProps) {
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    strike: false,
    h1: false,
    h2: false,
    ul: false,
    ol: false,
    quote: false,
  });

  // Track active formatting based on current selection
  const updateActiveFormats = useCallback(() => {
    if (typeof document === "undefined") return;
    try {
      const isBold = document.queryCommandState("bold");
      const isItalic = document.queryCommandState("italic");
      const isStrike = document.queryCommandState("strikeThrough");
      const isUl = document.queryCommandState("insertUnorderedList");
      const isOl = document.queryCommandState("insertOrderedList");
      const block = (
        document.queryCommandValue("formatBlock") || ""
      ).toLowerCase();
      setActiveFormats({
        bold: isBold,
        italic: isItalic,
        strike: isStrike,
        h1: block === "h1",
        h2: block === "h2",
        ul: isUl,
        ol: isOl,
        quote: block === "blockquote",
      });
    } catch {
      // Ignore if editor not focused
    }
  }, []);

  // Formatting execution using document.execCommand for native visual formatting
  const executeCommand = useCallback(
    (command: string, value: string | undefined = undefined) => {
      if (!editorRef.current) return;
      editorRef.current.focus();
      document.execCommand(command, false, value);
      onInput();
    },
    [editorRef, onInput],
  );

  const insertCode = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      document.execCommand(
        "insertHTML",
        false,
        '<code style="background:#161616;border:1px solid #222222;color:#9d8ff5;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px;">code</code>&nbsp;',
      );
    } else {
      const text = selection.toString();
      document.execCommand(
        "insertHTML",
        false,
        `<code style="background:#161616;border:1px solid #222222;color:#9d8ff5;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px;">${text}</code>`,
      );
    }
    onInput();
  }, [editorRef, onInput]);

  const insertCheckbox = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    const selection = window.getSelection();
    const text =
      selection && selection.toString().trim()
        ? selection.toString()
        : "Task item";
    const html = `<div class="todo-item" style="display:flex;align-items:flex-start;gap:8px;margin:6px 0;">
      <input type="checkbox" style="width:16px;height:16px;margin-top:3px;accent-color:#7c6af0;cursor:pointer;" />
      <span style="font-size:14px;color:#ddd;">${text}</span>
    </div><p><br></p>`;
    document.execCommand("insertHTML", false, html);
    onInput();
  }, [editorRef, onInput]);

  // Keyboard handling inside editor (Enter in checklist items)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        const selection = window.getSelection();
        if (selection && selection.anchorNode) {
          const parentTodo = (
            selection.anchorNode instanceof HTMLElement
              ? selection.anchorNode
              : selection.anchorNode.parentElement
          )?.closest(".todo-item");

          if (parentTodo) {
            e.preventDefault();
            const newTodo = document.createElement("div");
            newTodo.className = "todo-item";
            newTodo.style.cssText =
              "display:flex;align-items:flex-start;gap:8px;margin:6px 0;";
            newTodo.innerHTML = `<input type="checkbox" style="width:16px;height:16px;margin-top:3px;accent-color:#7c6af0;cursor:pointer;" /> <span style="color:#ddd;font-size:14px;"><br></span>`;
            parentTodo.after(newTodo);
            const span = newTodo.querySelector("span");
            if (span) {
              const range = document.createRange();
              range.setStart(span, 0);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
            onInput();
          }
        }
      }
    },
    [onInput],
  );

  // Checkbox toggle click handling
  const handleEditorClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        target.tagName === "INPUT" &&
        (target as HTMLInputElement).type === "checkbox"
      ) {
        const cb = target as HTMLInputElement;
        const span = cb.nextElementSibling as HTMLElement;
        if (span) {
          if (cb.checked) {
            span.style.textDecoration = "line-through";
            span.style.color = "#666";
            cb.setAttribute("checked", "checked");
          } else {
            span.style.textDecoration = "none";
            span.style.color = "#ddd";
            cb.removeAttribute("checked");
          }
        }
        onInput();
      }
      updateActiveFormats();
    },
    [onInput, updateActiveFormats],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
      onInput();
    },
    [onInput],
  );

  return {
    activeFormats,
    updateActiveFormats,
    executeCommand,
    insertCode,
    insertCheckbox,
    handleKeyDown,
    handleEditorClick,
    handlePaste,
  };
}
