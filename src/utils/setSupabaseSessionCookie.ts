import { Response } from "express";
import { env } from "../env";

export function setSupabaseSessionCookie(response: Response, cookieData: any, cookieMaxAge: number) {
  response.cookie("sb-session", cookieData, {
    maxAge: cookieMaxAge,
    httpOnly: true,
    secure: env.NODE_ENV === "production",
  });
}