const TUMBLR_API_BASE_URL = 'https://api.tumblr.com/v2';
const DEFAULT_MAX_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 400;

const userRequestQueue = new Map<string, Promise<unknown>>();

interface TumblrRequestOptions {
  token: string;
  path: string;
  method?: 'GET' | 'POST';
  params?: Record<string, string>;
  body?: unknown;
  maxRetries?: number;
  queueKey?: string;
}

interface TumblrErrorPayload {
  error?: string;
  errors?: Array<{ code?: number; title?: string; detail?: string }>;
  msg?: string;
}

export class TumblrApiError extends Error {
  status: number;
  isAuthError: boolean;
  isRateLimitError: boolean;
  isRetryable: boolean;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'TumblrApiError';
    this.status = status;
    this.isAuthError = status === 401 || status === 403;
    this.isRateLimitError = status === 429;
    this.isRetryable = status === 429 || status >= 500;
  }
}

function buildUrl(path: string, params?: Record<string, string>) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${TUMBLR_API_BASE_URL}${normalizedPath}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return url;
}

function parseRetryAfterMs(retryAfter: string | null): number | null {
  if (!retryAfter) return null;
  const asSeconds = Number.parseInt(retryAfter, 10);
  if (!Number.isNaN(asSeconds)) {
    return asSeconds * 1000;
  }

  const asDate = Date.parse(retryAfter);
  if (!Number.isNaN(asDate)) {
    return Math.max(asDate - Date.now(), 0);
  }

  return null;
}

function getRetryDelayMs(attempt: number, retryAfterHeader: string | null) {
  const retryAfterMs = parseRetryAfterMs(retryAfterHeader);
  if (retryAfterMs !== null) {
    return retryAfterMs;
  }

  const exponentialBackoff = BASE_RETRY_DELAY_MS * 2 ** attempt;
  const jitter = Math.floor(Math.random() * 250);
  return exponentialBackoff + jitter;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractErrorMessage(
  payload: TumblrErrorPayload | null,
  status: number
) {
  if (payload?.error) return payload.error;
  if (payload?.msg) return payload.msg;
  if (payload?.errors?.[0]?.detail) return payload.errors[0].detail;
  if (payload?.errors?.[0]?.title) return payload.errors[0].title;
  return `Tumblr API request failed with status ${status}`;
}

async function parseErrorPayload(
  res: Response
): Promise<TumblrErrorPayload | null> {
  try {
    return (await res.json()) as TumblrErrorPayload;
  } catch {
    return null;
  }
}

async function performTumblrRequest<T>({
  token,
  path,
  method = 'GET',
  params,
  body,
  maxRetries = DEFAULT_MAX_RETRIES,
}: TumblrRequestOptions): Promise<T> {
  const url = buildUrl(path, params);

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (res.ok) {
        if (res.status === 204) {
          return {} as T;
        }
        return (await res.json()) as T;
      }

      const payload = await parseErrorPayload(res);
      const error = new TumblrApiError(
        extractErrorMessage(payload, res.status),
        res.status
      );

      if (!error.isRetryable || attempt === maxRetries) {
        throw error;
      }

      const retryDelayMs = getRetryDelayMs(
        attempt,
        res.headers.get('retry-after')
      );
      await sleep(retryDelayMs);
    } catch (error) {
      const networkError = error instanceof TypeError;
      if (!networkError || attempt === maxRetries) {
        throw error;
      }
      await sleep(getRetryDelayMs(attempt, null));
    }
  }

  throw new Error('Tumblr request exhausted retries unexpectedly.');
}

export async function tumblrRequest<T>(
  options: TumblrRequestOptions
): Promise<T> {
  const { queueKey } = options;
  if (!queueKey) {
    return performTumblrRequest<T>(options);
  }

  const previousTask = userRequestQueue.get(queueKey) ?? Promise.resolve();
  const nextTask = previousTask
    .catch(() => undefined)
    .then(() => performTumblrRequest<T>(options));

  userRequestQueue.set(queueKey, nextTask);

  return nextTask.finally(() => {
    if (userRequestQueue.get(queueKey) === nextTask) {
      userRequestQueue.delete(queueKey);
    }
  });
}
