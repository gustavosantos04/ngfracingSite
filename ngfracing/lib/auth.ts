import { timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/constants";

const encoder = new TextEncoder();

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET?.trim();
  if (!jwtSecret) {
    throw new Error("Missing JWT_SECRET environment variable");
  }
  return encoder.encode(jwtSecret);
}

function getConfiguredAdminCredentials() {
  const identifier = process.env.ADMIN_USER ?? null;
  const password = process.env.ADMIN_PASSWORD ?? null;

  if (!identifier || !password) {
    return null;
  }

  return {
    identifier: identifier.trim().toLowerCase(),
    password
  };
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export async function signAdminToken(payload: {
  userId: string;
  email: string;
  role: string;
}) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(getJwtSecret());
}

export async function verifyAdminToken(token: string) {
  const verified = await jwtVerify(token, getJwtSecret());
  return verified.payload as {
    userId: string;
    email: string;
    role: string;
    exp: number;
  };
}

export async function authenticateAdmin(identifier: string, password: string) {
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const configuredAdmin = getConfiguredAdminCredentials();
  const jwtSecretConfigured = Boolean(process.env.JWT_SECRET?.trim());

  if (!configuredAdmin || !jwtSecretConfigured) {
    return null;
  }

  if (!safeEqual(normalizedIdentifier, configuredAdmin.identifier)) {
    return null;
  }

  if (!safeEqual(password, configuredAdmin.password)) {
    return null;
  }

  return {
    id: "env-admin",
    email: configuredAdmin.identifier,
    role: "ADMIN" as const
  };
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function assertAdminRequest() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
