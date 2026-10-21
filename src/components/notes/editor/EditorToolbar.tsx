"use client";

import React from "react";
import ToolbarButton from "./ToolbarButton";
import type { EditorToolbarProps } from "@/utils/notes.editor.types";
import {
  CodeIcon,
  BulletListIcon,
  NumberedListIcon,
  ChecklistIcon,
  BlockquoteIcon,
} from "@/constants/Icons";

export default function EditorToolbar({
  activeFormats,
  onExecuteCommand,
  onInsertCode,
  onInsertCheckbox,
}: EditorToolbarProps) {
  return (
    <div
      className="flex items-center gap-0.5 px-6 py-2 flex-shrink-0"
      style={{ borderBottom: "1px solid #222222" }}
    >
      <ToolbarButton
        title="Bold (Ctrl+B)"
        active={activeFormats.bold}
        onMouseDown={(e) => {
          e.preventDefault();
          onExecuteCommand("bold");
        }}
      >
        <span style={{ fontWeight: 700 }}>B</span>
      </ToolbarButton>

      <ToolbarButton
        title="Italic (Ctrl+I)"
        active={activeFormats.italic}
        onMouseDown={(e) => {
          e.preventDefault();
          onExecuteCommand("italic");
        }}
      >
        <em>I</em>
      </ToolbarButton>

      <ToolbarButton
        title="Strikethrough"
        active={activeFormats.strike}
        onMouseDown={(e) => {
          e.preventDefault();
          onExecuteCommand("strikeThrough");
        }}
      >
        <s>S</s>
      </ToolbarButton>

      <ToolbarButton
        title="Inline code"
        onMouseDown={(e) => {
          e.preventDefault();
          onInsertCode();
        }}
      >
        <CodeIcon />
      </ToolbarButton>

      <div
        style={{
          width: "1px",
          height: "16px",
          backgroundColor: "#222222",
          margin: "0 4px",
        }}
      />

      <ToolbarButton
        title="Heading 1"
        active={activeFormats.h1}
        onMouseDown={(e) => {
          e.preventDefault();
          onExecuteCommand("formatBlock", activeFormats.h1 ? "<p>" : "<h1>");
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 700 }}>H1</span>
      </ToolbarButton>

      <ToolbarButton
        title="Heading 2"
        active={activeFormats.h2}
        onMouseDown={(e) => {
          e.preventDefault();
          onExecuteCommand("formatBlock", activeFormats.h2 ? "<p>" : "<h2>");
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 700 }}>H2</span>
      </ToolbarButton>

      <div
        style={{
          width: "1px",
          height: "16px",
          backgroundColor: "#222222",
          margin: "0 4px",
        }}
      />

      <ToolbarButton
        title="Bullet list"
        active={activeFormats.ul}
        onMouseDown={(e) => {
          e.preventDefault();
          onExecuteCommand("insertUnorderedList");
        }}
      >
        <BulletListIcon />
      </ToolbarButton>

      <ToolbarButton
        title="Numbered list"
        active={activeFormats.ol}
        onMouseDown={(e) => {
          e.preventDefault();
          onExecuteCommand("insertOrderedList");
        }}
      >
        <NumberedListIcon />
      </ToolbarButton>

      <ToolbarButton
        title="Checklist task"
        onMouseDown={(e) => {
          e.preventDefault();
          onInsertCheckbox();
        }}
      >
        <ChecklistIcon />
      </ToolbarButton>

      <ToolbarButton
        title="Blockquote"
        active={activeFormats.quote}
        onMouseDown={(e) => {
          e.preventDefault();
          onExecuteCommand("formatBlock", activeFormats.quote ? "<p>" : "<blockquote>");
        }}
      >
        <BlockquoteIcon />
      </ToolbarButton>

      <div style={{ flex: 1 }} />
    </div>
  );
}
