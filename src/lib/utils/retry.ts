export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  let lastError: Error;
  let delay = options.initialDelay;

  for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === options.maxRetries) {
        throw lastError;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, options.maxDelay);
    }
  }

  throw lastError!;
}