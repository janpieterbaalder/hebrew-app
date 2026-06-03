import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE = "hebrew-session";

// Fail fast on a missing secret. Without this, an unset AUTH_SECRET would
// silently encode to an empty key, making session tokens trivially forgeable.
// Use a strong value of at least 32 characters in production.
const authSecret = process.env.AUTH_SECRET;
if (!authSecret) {
  throw new Error("AUTH_SECRET environment variable is not set.");
}
if (process.env.NODE_ENV === "production" && authSecret.length < 32) {
  console.warn(
    "AUTH_SECRET is shorter than 32 characters; use a stronger secret."
  );
}
const secret = new TextEncoder().encode(authSecret);

export interface Session {
  userId: string;
  email: string;
}

export async function createSession(userId: string, email: string) {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
