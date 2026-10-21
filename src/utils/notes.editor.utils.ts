/**
 * notes.editor.utils.ts
 * Shared formatting, markdown parsing, and styling utilities for Notes & NotesEditor.
 */

// ─── Tag Colors ──────────────────────────────────────────────────────────────

export const TAG_PALETTE = [
  "#7c6af0",
  "#9d8ff5",
  "#4caf7d",
  "#f0a44f",
  "#f06a6a",
];

export function tagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return TAG_PALETTE[Math.abs(hash) % TAG_PALETTE.length];
}

// ─── Markdown / HTML Formatting ──────────────────────────────────────────────

export function formatInline(str: string): string {
  return str
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.*?)__/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/_(.*?)_/g, "<em>$1</em>")
    .replace(/~~(.*?)~~/g, "<del>$1</del>")
    .replace(
      /`([^`]+)`/g,
      '<code style="background:#161616;border:1px solid #222222;color:#9d8ff5;padding:2px 6px;border-radius:4px;font-family:monospace;font-size:12px;">$1</code>',
    );
}

export function markdownToHtml(md: string): string {
  if (!md) return "<p><br></p>";

  // If already rich HTML, preserve it
  if (
    /<(p|h[1-6]|ul|ol|li|blockquote|div|strong|em|b|i|s|del|code)[^>]*>/i.test(
      md,
    )
  ) {
    return md;
  }

  const lines = md.split("\n");
  let html = "";
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Checklist item
    const checkMatch = line.match(/^-\s+\[([ xX])\]\s+(.*)/);
    if (checkMatch) {
      if (inList) {
        html += "</ul>";
        inList = false;
      }
      const isChecked = checkMatch[1] === "x" || checkMatch[1] === "X";
      const text = checkMatch[2];
      html += `<div class="todo-item" style="display:flex;align-items:flex-start;gap:8px;margin:6px 0;">
        <input type="checkbox" ${isChecked ? "checked" : ""} style="width:16px;height:16px;margin-top:3px;accent-color:#7c6af0;cursor:pointer;" />
        <span style="${isChecked ? "text-decoration:line-through;color:#666;" : "color:#ddd;font-size:14px;"}">${formatInline(text)}</span>
      </div>`;
      continue;
    }

    // Bullet list
    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      if (!inList) {
        html += '<ul style="list-style-type:disc;padding-left:24px;margin:8px 0;">';
        inList = true;
      }
      html += `<li style="margin:4px 0;">${formatInline(bulletMatch[1])}</li>`;
      continue;
    } else if (inList) {
      html += "</ul>";
      inList = false;
    }

    // Heading 1
    if (/^#\s+(.*)/.test(line)) {
      html += `<h1 style="font-size:24px;font-weight:800;color:#fff;margin:18px 0 8px 0;letter-spacing:-0.02em;">${formatInline(line.replace(/^#\s+/, ""))}</h1>`;
      continue;
    }

    // Heading 2
    if (/^##\s+(.*)/.test(line)) {
      html += `<h2 style="font-size:19px;font-weight:700;color:#fff;margin:14px 0 6px 0;letter-spacing:-0.01em;">${formatInline(line.replace(/^##\s+/, ""))}</h2>`;
      continue;
    }

    // Heading 3
    if (/^###\s+(.*)/.test(line)) {
      html += `<h3 style="font-size:16px;font-weight:600;color:#eee;margin:12px 0 4px 0;">${formatInline(line.replace(/^###\s+/, ""))}</h3>`;
      continue;
    }

    // Blockquote
    if (/^>\s+(.*)/.test(line)) {
      html += `<blockquote style="border-left:3px solid #7c6af0;padding:8px 14px;margin:12px 0;background:rgba(124,106,240,0.08);border-radius:0 8px 8px 0;color:#aaa;font-style:italic;">${formatInline(line.replace(/^>\s+/, ""))}</blockquote>`;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      html += "<p><br></p>";
      continue;
    }

    // Regular line
    html += `<p style="margin:6px 0;line-height:1.75;color:#ccc;font-size:14px;">${formatInline(line)}</p>`;
  }

  if (inList) html += "</ul>";
  return html;
}

// ─── Scoped Editor CSS ────────────────────────────────────────────────────────

export const EDITOR_SURFACE_CSS = `
  .notes-editor-surface h1 {
    font-size: 24px;
    font-weight: 800;
    color: #ffffff;
    margin: 18px 0 8px 0;
    letter-spacing: -0.02em;
  }
  .notes-editor-surface h2 {
    font-size: 19px;
    font-weight: 700;
    color: #ffffff;
    margin: 14px 0 6px 0;
    letter-spacing: -0.01em;
  }
  .notes-editor-surface h3 {
    font-size: 16px;
    font-weight: 600;
    color: #eeeeee;
    margin: 12px 0 4px 0;
  }
  .notes-editor-surface p {
    font-size: 14px;
    line-height: 1.75;
    color: #cccccc;
    margin: 6px 0;
  }
  .notes-editor-surface b,
  .notes-editor-surface strong {
    font-weight: 700;
    color: #ffffff;
  }
  .notes-editor-surface i,
  .notes-editor-surface em {
    font-style: italic;
    color: #dddddd;
  }
  .notes-editor-surface s,
  .notes-editor-surface strike,
  .notes-editor-surface del {
    text-decoration: line-through;
    color: #666666;
  }
  .notes-editor-surface ul {
    list-style-type: disc;
    padding-left: 24px;
    margin: 8px 0;
    color: #cccccc;
  }
  .notes-editor-surface ol {
    list-style-type: decimal;
    padding-left: 24px;
    margin: 8px 0;
    color: #cccccc;
  }
  .notes-editor-surface li {
    margin: 4px 0;
    line-height: 1.6;
  }
  .notes-editor-surface blockquote {
    border-left: 3px solid #7c6af0;
    padding: 8px 14px;
    margin: 12px 0;
    background: rgba(124, 106, 240, 0.08);
    border-radius: 0 8px 8px 0;
    color: #aaaaaa;
    font-style: italic;
  }
  .notes-editor-surface code {
    background: #161616;
    border: 1px solid #222222;
    color: #9d8ff5;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
  }
  .notes-editor-surface:empty::before {
    content: attr(data-placeholder);
    color: #444444;
    pointer-events: none;
    display: block;
  }
`;
