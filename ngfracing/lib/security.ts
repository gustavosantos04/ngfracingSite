import { headers } from "next/headers";

type HeaderLike = Pick<Headers, "get">;

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitRecord = {
  count: number;
  expiresAt: number;
};

const rateLimitStore = new Map<string, RateLimitRecord>();

function getBaseOrigin() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!baseUrl) {
    return null;
  }

  try {
    return new URL(baseUrl).origin;
  } catch {
    return null;
  }
}

function extractForwardedProto(headerStore: HeaderLike) {
  return headerStore.get("x-forwarded-proto")?.split(",")[0]?.trim() || "https";
}

function extractForwardedHost(headerStore: HeaderLike) {
  return (
    headerStore.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    headerStore.get("host")?.split(",")[0]?.trim() ||
    null
  );
}

function getAllowedOrigins(headerStore: HeaderLike, requestUrl?: string) {
  const allowedOrigins = new Set<string>();
  const baseOrigin = getBaseOrigin();

  if (baseOrigin) {
    allowedOrigins.add(baseOrigin);
  }

  const forwardedHost = extractForwardedHost(headerStore);
  if (forwardedHost) {
    allowedOrigins.add(`${extractForwardedProto(headerStore)}://${forwardedHost}`);
    allowedOrigins.add(`https://${forwardedHost}`);
    allowedOrigins.add(`http://${forwardedHost}`);
  }

  if (requestUrl) {
    try {
      allowedOrigins.add(new URL(requestUrl).origin);
    } catch {
      // Ignore malformed request URLs.
    }
  }

  return allowedOrigins;
}

function isTrustedOrigin(origin: string | null, headerStore: HeaderLike, requestUrl?: string) {
  if (!origin) {
    return false;
  }

  try {
    const normalizedOrigin = new URL(origin).origin;
    return getAllowedOrigins(headerStore, requestUrl).has(normalizedOrigin);
  } catch {
    return false;
  }
}

export async function assertSameOriginActionRequest() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  if (!isTrustedOrigin(origin, headerStore)) {
    throw new Error("INVALID_ORIGIN");
  }
}

export function assertSameOriginRequest(request: Request) {
  if (!isTrustedOrigin(request.headers.get("origin"), request.headers, request.url)) {
    throw new Error("INVALID_ORIGIN");
  }
}

function getClientIpFromHeaderStore(headerStore: HeaderLike) {
  const forwardedFor = headerStore.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return headerStore.get("x-real-ip")?.trim() || "unknown";
}

export async function getActionRequestFingerprint(scope: string, identifier?: string) {
  const headerStore = await headers();
  const ip = getClientIpFromHeaderStore(headerStore);
  return `${scope}:${ip}:${identifier?.trim().toLowerCase() || "anonymous"}`;
}

export function getRequestFingerprint(scope: string, request: Request, identifier?: string) {
  const ip = getClientIpFromHeaderStore(request.headers);
  return `${scope}:${ip}:${identifier?.trim().toLowerCase() || "anonymous"}`;
}

export function consumeRateLimit(key: string, options: RateLimitOptions) {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.expiresAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      expiresAt: now + options.windowMs
    });

    return {
      allowed: true,
      remaining: Math.max(0, options.limit - 1),
      retryAfterMs: options.windowMs
    };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, current.expiresAt - now)
    };
  }

  current.count += 1;
  rateLimitStore.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(0, options.limit - current.count),
    retryAfterMs: Math.max(0, current.expiresAt - now)
  };
}
