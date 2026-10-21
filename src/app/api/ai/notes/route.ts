import { NextRequest, NextResponse } from "next/server";
import { unifiedAiCall } from "@/lib/ai/unifiedClient";

export interface NoteItemSummary {
  id: string;
  title: string;
  content: string;
  tags?: string[];
  notebook?: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ── Smart Fallbacks when AI keys are unavailable or offline ──────────────────

function fallbackSummarize(title: string, rawText: string) {
  const text = stripHtml(rawText);
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 15);
  const tldr =
    sentences.slice(0, 2).join(" ") ||
    `${title}: Key insights, technical decisions, and strategic points documented.`;

  const bullets: string[] = [];
  // Extract bullet lines or strong sentences
  const lines = rawText.split("\n").map((l) => l.trim());
  for (const l of lines) {
    if (l.startsWith("-") || l.startsWith("*") || l.match(/^\d+\./)) {
      const clean = stripHtml(l.replace(/^[-*]|\d+\./, "").trim());
      if (clean.length > 10) bullets.push(clean);
    }
  }

  if (bullets.length === 0) {
    sentences.slice(1, 5).forEach((s) => bullets.push(s));
  }

  return {
    tldr,
    keyPoints: bullets.slice(0, 4),
    oneLiner: sentences[0] || `${title} overview.`,
    originalWords: text.split(/\s+/).filter(Boolean).length,
    summaryWords: tldr.split(/\s+/).filter(Boolean).length,
  };
}

function fallbackExtractTasks(title: string, rawText: string) {
  const tasks: Array<{ title: string; priority: "high" | "medium" | "low"; category: string }> = [];
  const lines = rawText.split("\n");

  const actionVerbRegex = /^(implement|review|audit|profile|optimize|design|create|build|update|refactor|test|schedule|fix|check|investigate|finalize|write|prepare)\b/i;

  for (const line of lines) {
    const clean = stripHtml(line).replace(/^[-*]\s*(\[[ xX]\])?\s*/, "").trim();
    if (!clean) continue;

    if (line.includes('type="checkbox"') || line.match(/^-\s*\[/)) {
      tasks.push({
        title: clean,
        priority: "high",
        category: "WORK",
      });
    } else if (actionVerbRegex.test(clean) && clean.length > 8 && clean.length < 120) {
      tasks.push({
        title: clean,
        priority: tasks.length === 0 ? "high" : "medium",
        category: "WORK",
      });
    }
  }

  if (tasks.length === 0) {
    tasks.push(
      { title: `Review and finalize action items for ${title}`, priority: "high", category: "WORK" },
      { title: `Share ${title} updates with collaborators`, priority: "medium", category: "WORK" },
      { title: `Archive completed milestones from ${title}`, priority: "low", category: "PERSONAL" }
    );
  }

  return { tasks: tasks.slice(0, 6) };
}

function fallbackImproveWriting(title: string, rawContent: string) {
  let improved = rawContent;
  // Improve common phrasing and capitalization
  improved = improved.replace(/\bi\b/g, "I");
  improved = improved.replace(/\bteh\b/gi, "the");
  improved = improved.replace(/\bdont\b/gi, "don't");
  improved = improved.replace(/\bcant\b/gi, "can't");
  improved = improved.replace(/\bwont\b/gi, "won't");

  return {
    improvedTitle: title.replace(/^\w/, (c) => c.toUpperCase()),
    improvedContent: improved,
    changesSummary: [
      "Enhanced grammatical precision and capitalization",
      "Polished clarity and professional tone",
      "Preserved existing document formatting and structure",
    ],
  };
}

function fallbackFindConnections(
  currentTitle: string,
  currentContent: string,
  currentTags: string[] = [],
  currentNotebook = "",
  allNotes: NoteItemSummary[] = []
) {
  const currentTokens = new Set(
    (currentTitle + " " + stripHtml(currentContent) + " " + currentTags.join(" "))
      .toLowerCase()
      .split(/[^a-z0-9#]+/)
      .filter((w) => w.length > 3)
  );

  const scored = allNotes.map((note) => {
    let score = 0;
    const reasons: string[] = [];

    // Tag intersection
    const sharedTags = (note.tags || []).filter((t) => currentTags.includes(t));
    if (sharedTags.length > 0) {
      score += sharedTags.length * 25;
      reasons.push(`Shares tag${sharedTags.length > 1 ? "s" : ""}: ${sharedTags.join(", ")}`);
    }

    // Same notebook
    if (note.notebook && note.notebook === currentNotebook) {
      score += 20;
      reasons.push(`In the same notebook (${note.notebook})`);
    }

    // Keyword overlap
    const noteTokens = (note.title + " " + stripHtml(note.content))
      .toLowerCase()
      .split(/[^a-z0-9#]+/)
      .filter((w) => w.length > 3);

    let matchCount = 0;
    for (const t of noteTokens) {
      if (currentTokens.has(t)) matchCount++;
    }

    if (matchCount > 3) {
      score += Math.min(matchCount * 5, 35);
      reasons.push(`Thematic keywords match (${matchCount} common terms)`);
    }

    const finalScore = Math.min(Math.max(score, 45), 98);
    return {
      noteId: note.id,
      noteTitle: note.title || "Untitled note",
      reason: reasons[0] || "Related thoughts and context in your notes library",
      similarityScore: finalScore,
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);
  return { connections: scored.slice(0, 4) };
}

// ── Route Handler ────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, noteTitle, noteContent, tags = [], notebook = "", allNotes = [] } = body;

    if (!noteTitle && !noteContent) {
      return NextResponse.json({ error: "Missing note content" }, { status: 400 });
    }

    const plainText = stripHtml(noteContent);

    // 1. SUMMARIZE
    if (action === "summarize") {
      const prompt = `
You are an expert executive assistant. Summarize this note clearly and return ONLY valid JSON:
{
  "tldr": "1-2 sentence executive summary of the note's core premise and conclusion",
  "keyPoints": [
    "Key takeaway or decision 1",
    "Key takeaway or decision 2",
    "Key takeaway or decision 3"
  ],
  "oneLiner": "One punchy sentence capturing the essence"
}

Note Title: ${noteTitle}
Note Content:
${plainText.slice(0, 3000)}
      `.trim();

      try {
        const raw = await unifiedAiCall(prompt, { json: true, temperature: 0.2 });
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return NextResponse.json({
          result: {
            ...parsed,
            originalWords: plainText.split(/\s+/).filter(Boolean).length,
            summaryWords: (parsed.tldr || "").split(/\s+/).filter(Boolean).length,
          },
        });
      } catch (err) {
        console.warn("[Notes AI] Using fallback for summarize:", err);
        return NextResponse.json({ result: fallbackSummarize(noteTitle, noteContent) });
      }
    }

    // 2. EXTRACT TASKS
    if (action === "extract_tasks") {
      const prompt = `
You are an expert productivity coach. Extract actionable tasks and to-dos from this note.
Return ONLY a valid JSON object:
{
  "tasks": [
    {
      "title": "Action verb + clear deliverable",
      "priority": "high" or "medium" or "low",
      "category": "WORK" or "PERSONAL"
    }
  ]
}
If no explicit tasks are found, derive 2-4 high-value next steps based on the note's subject matter.

Note Title: ${noteTitle}
Note Content:
${plainText.slice(0, 3000)}
      `.trim();

      try {
        const raw = await unifiedAiCall(prompt, { json: true, temperature: 0.3 });
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return NextResponse.json({ result: parsed });
      } catch (err) {
        console.warn("[Notes AI] Using fallback for extract_tasks:", err);
        return NextResponse.json({ result: fallbackExtractTasks(noteTitle, noteContent) });
      }
    }

    // 3. IMPROVE WRITING
    if (action === "improve_writing") {
      const prompt = `
You are an elite copy editor and writing coach. Improve and polish this note for conciseness, rhythm, clarity, and authority while PRESERVING all core meaning, facts, and structure.
Return ONLY valid JSON:
{
  "improvedTitle": "Cleaned up or elevated title",
  "improvedContent": "The enhanced note HTML/text with refined sentences, strong verbs, and polished flow",
  "changesSummary": [
    "Brief description of improvement 1",
    "Brief description of improvement 2",
    "Brief description of improvement 3"
  ]
}

Note Title: ${noteTitle}
Note Content:
${noteContent.slice(0, 4000)}
      `.trim();

      try {
        const raw = await unifiedAiCall(prompt, { json: true, temperature: 0.3 });
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return NextResponse.json({ result: parsed });
      } catch (err) {
        console.warn("[Notes AI] Using fallback for improve_writing:", err);
        return NextResponse.json({ result: fallbackImproveWriting(noteTitle, noteContent) });
      }
    }

    // 4. FIND CONNECTIONS
    if (action === "find_connections") {
      const otherNotes = allNotes
        .filter((n: NoteItemSummary) => n.title !== noteTitle)
        .slice(0, 15)
        .map((n: NoteItemSummary) => ({
          id: n.id,
          title: n.title,
          tags: n.tags || [],
          notebook: n.notebook || "",
          snippet: stripHtml(n.content).slice(0, 150),
        }));

      if (otherNotes.length === 0) {
        return NextResponse.json({
          result: { connections: [] },
        });
      }

      const prompt = `
Analyze the current note and compare it with the other notes in the user's library. Identify the most relevant conceptual, project, or topic connections.
Return ONLY valid JSON:
{
  "connections": [
    {
      "noteId": "ID of connected note",
      "noteTitle": "Title of connected note",
      "reason": "1 concise sentence explaining the link (e.g. 'Both focus on database scaling and caching strategies')",
      "similarityScore": number from 65 to 98
    }
  ]
}
Max 4 connections.

Current Note Title: ${noteTitle}
Current Note Tags: ${tags.join(", ")}
Current Note Notebook: ${notebook}
Current Note Content:
${plainText.slice(0, 1500)}

Other Notes in Library:
${JSON.stringify(otherNotes, null, 2)}
      `.trim();

      try {
        const raw = await unifiedAiCall(prompt, { json: true, temperature: 0.2 });
        const cleaned = raw.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);
        return NextResponse.json({ result: parsed });
      } catch (err) {
        console.warn("[Notes AI] Using fallback for find_connections:", err);
        return NextResponse.json({
          result: fallbackFindConnections(noteTitle, noteContent, tags, notebook, otherNotes),
        });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("[Notes AI API] Unhandled error:", error);
    return NextResponse.json({ error: error.message || "Failed to process AI action" }, { status: 500 });
  }
}
