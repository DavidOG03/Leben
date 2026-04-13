// lib/ai/unifiedClient.ts
import { GoogleGenAI } from "@google/genai";

interface UnifiedAiOptions {
  json?: boolean;
  temperature?: number;
}

/**
 * A unified AI client that load-balances and fails over between:
 * 1. DeepSeek (Primary)
 * 2. Groq (Secondary)
 * 3. Gemini (Fallback)
 *
 * This ensures maximum RPM and reliability.
 */
export async function unifiedAiCall(
  prompt: string,
  options: UnifiedAiOptions = {},
) {
  const providers = [
    { name: "DeepSeek", call: callDeepSeek },
    { name: "Groq", call: callGroq },
    { name: "Gemini", call: callGemini },
  ];

  let lastError: any = null;

  for (const provider of providers) {
    try {
      console.log(`[UnifiedAI] Attempting ${provider.name}...`);
      const result = await provider.call(prompt, options);
      if (result) {
        console.log(`[UnifiedAI] Success with ${provider.name}`);
        return result;
      }
    } catch (err: any) {
      console.warn(`[UnifiedAI] ${provider.name} failed:`, err.message || err);
      lastError = err;
      // Continue to next provider
    }
  }

  throw lastError || new Error("All AI providers failed.");
}

// --- DeepSeek (OpenAI Compatible) ---
async function callDeepSeek(prompt: string, options: UnifiedAiOptions) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("Missing DeepSeek API Key");

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      response_format: options.json ? { type: "json_object" } : undefined,
      temperature: options.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(`DeepSeek Error: ${res.status} ${JSON.stringify(errData)}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// --- Groq (OpenAI Compatible) ---
async function callGroq(prompt: string, options: UnifiedAiOptions) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing Groq API Key");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: options.json ? { type: "json_object" } : undefined,
      temperature: options.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(`Groq Error: ${res.status} ${JSON.stringify(errData)}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// --- Gemini (Fallback) ---
async function callGemini(prompt: string, options: UnifiedAiOptions) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing Gemini API Key");

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { apiVersion: "v1" },
  });

  const result: any = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });

  let raw = "";
  if (typeof result.text === "string") {
    raw = result.text;
  } else if (typeof result.response?.text === "function") {
    raw = await result.response.text();
  } else if (result.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
    raw = result.response.candidates[0].content.parts[0].text;
  }

  if (!raw) throw new Error("Gemini returned empty response");
  return raw;
}
