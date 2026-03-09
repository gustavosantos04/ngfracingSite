import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const encoder = new TextEncoder();

function getJwtSecret() {
  return encoder.encode(process.env.JWT_SECRET ?? "ngf-racing-dev-secret");
}

function getConfiguredAdminCredentials() {
  const identifier = process.env.ADMIN_USER ?? process.env.ADMIN_EMAIL ?? null;
  const password = process.env.ADMIN_PASSWORD ?? null;

  if (!identifier || !password) {
    return null;
  }

  return {
    identifier: identifier.trim().toLowerCase(),
    password
  };
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

  if (
    configuredAdmin &&
    normalizedIdentifier === configuredAdmin.identifier &&
    password === configuredAdmin.password
  ) {
    return {
      id: "env-admin",
      email: configuredAdmin.identifier,
      role: "ADMIN"
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedIdentifier }
  });

  if (!user) {
    return null;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return null;
  }

  return user;
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
