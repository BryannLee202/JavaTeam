import { randomBytes, timingSafeEqual } from "crypto";
import { Response } from "express";

export const ACCESS_TOKEN_COOKIE = "shms_at";
export const REFRESH_TOKEN_COOKIE = "shms_rt";
export const CSRF_TOKEN_COOKIE = "XSRF-TOKEN"; 
export const CSRF_HEADER = "x-xsrf-token"; 

const isProd = process.env.NODE_ENV === "production";

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  const commonOptions = {
    httpOnly: true,
    secure: isProd, 
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    path: "/",
  };
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, { ...commonOptions, maxAge: 60 * 60 * 1000 });
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, { ...commonOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE, { path: "/" });
  res.clearCookie(REFRESH_TOKEN_COOKIE, { path: "/" });
}

export function issueCsrfCookie(res: Response) {
  const token = randomBytes(32).toString("hex");
  res.cookie(CSRF_TOKEN_COOKIE, token, {
    httpOnly: false,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as "none" | "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function csrfTokensMatch(cookieToken?: string, headerToken?: string) {
  if (!cookieToken || !headerToken) return false;
  const a = Buffer.from(cookieToken);
  const b = Buffer.from(headerToken);
  return a.length === b.length && timingSafeEqual(a, b);
}