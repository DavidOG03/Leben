# Leben AI Architecture: Neural Engine

This document provides a technical reference for the AI Chat infrastructure within the Leben application.

## 1. Core Logic Flow

The AI interaction follows a strictly bounded request-response cycle:

1.  **Frontend Intent**: User sends a message via `AIChatPanel.tsx`. 
2.  **State Management**: `useAIStore.ts` appends the user message and triggers an API call to `/api/ai/chat`.
3.  **Context Preparation**: The API route calls `buildUserContext()` to pull live data from Supabase.
4.  **Prompt Engineering**: A system instruction is prepended to the message history, grounding the AI in the fetched context.
5.  **Unified Execution**: The `unifiedAiCall` function attempts to generate a response using a prioritized list of providers.
6.  **Failover Logic**: If the primary provider fails, the system automatically retries with the next provider in the chain.

---

## 2. Component Reference

### A. API Route (`src/app/api/ai/chat/route.ts`)
The primary entry point. It handles:
- Request validation.
- Orchestrating `contextBuilder`.
- Constructing the final `messages` array with the `system` role instructions.

### B. Context Builder (`src/lib/ai/contextBuilder.ts`)
Responsible for data grounding.
- **Parallel Fetching**: Uses `Promise.all` to query Supabase for `tasks`, `habits`, `goals`, and `books` simultaneously.
- **Formatting**: Converts raw database rows into a structured Markdown string that the AI can easily parse as "USER CONTEXT".

### C. Unified AI Client (`src/lib/ai/unifiedClient.ts`)
The resilience layer. It ensures high availability (HA) by cascading through providers:

| Priority | Provider | Model | Implementation |
| :--- | :--- | :--- | :--- |
| **1 (Primary)** | **Gemini** | `gemini-2.5-flash` | Official `@google/genai` SDK |
| **2 (Failover)** | **DeepSeek** | `deepseek-chat` | REST API (Fetch) |
| **3 (Failover)** | **Groq** | `llama-3.3-70b` | REST API (Fetch) |

---

## 3. Strict Bounding & Security

To ensure the AI remains a "Neural Productivity Engine" rather than a general-purpose chatbot:
- **System Instructions**: The constant system prompt explicitly forbids the AI from discussing topics outside the provided context or general productivity.
- **Edge Protection**: Routes are protected via Supabase Middleware, ensuring only authenticated users can trigger AI generation.

## 4. Environment Variables
The following keys must be set in `.env.local`:
- `GEMINI_API_KEY`
- `DEEPSEEK_API_KEY`
- `GROQ_API_KEY`
