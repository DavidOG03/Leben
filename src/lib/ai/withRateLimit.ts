export type WaitCallback = (seconds: number) => void;

export async function executeWithRateLimit<T>(
  geminiCall: () => Promise<T>,
  openAICall: () => Promise<T>,
  onWait?: WaitCallback
): Promise<T> {
  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

  let geminiAttempts = 0;
  const maxGeminiAttempts = 2; // initial + 1 retry

  while (geminiAttempts < maxGeminiAttempts) {
    try {
      geminiAttempts++;
      return await geminiCall();
    } catch (geminiError: any) {
      console.warn(`Gemini Attempt ${geminiAttempts} Error:`, geminiError);

      const errString = JSON.stringify(geminiError, Object.getOwnPropertyNames(geminiError));
      // Match exact format returned by Google Gemini SDK for rate limits
      const match = errString.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
      
      if (match && match[1] && geminiAttempts < maxGeminiAttempts) {
        const waitSeconds = parseInt(match[1], 10);
        if (onWait) onWait(waitSeconds);
        await wait(waitSeconds * 1000);
        continue; // Retry Gemini
      }
      
      // If no valid retry strategy for Gemini or we exhausted attempts, break out to fallback
      break;
    }
  }

  console.warn("Falling back to OpenAI API after Gemini failed.");

  let openAIAttempts = 0;
  const maxOpenAIAttempts = 2; // initial + 1 retry

  while (openAIAttempts < maxOpenAIAttempts) {
    try {
      openAIAttempts++;
      return await openAICall();
    } catch (openAiError: any) {
      console.error(`OpenAI Attempt ${openAIAttempts} Error:`, openAiError);
      
      const openAiStr = openAiError.message || "";
      const retryMatch = openAiStr.match(/RETRY_AFTER_(\d+)/i);
      
      if (retryMatch && retryMatch[1] && openAIAttempts < maxOpenAIAttempts) {
        const waitSeconds = parseInt(retryMatch[1], 10);
        if (onWait) onWait(waitSeconds);
        await wait(waitSeconds * 1000);
        continue; // Retry OpenAI
      }

      // Exhausted OpenAI bounds too
      throw openAiError;
    }
  }

  throw new Error("API rate limits completely exhausted for both providers.");
}

export function generateOpenAiRateLimitError(response: Response): Error {
  if (response.status === 429) {
    const retryAfter = response.headers.get("retry-after") || "30"; // default 30s if missing 
    return new Error(`RETRY_AFTER_${retryAfter}`);
  }
  return new Error(`OpenAI API Error: ${response.status}`);
}
