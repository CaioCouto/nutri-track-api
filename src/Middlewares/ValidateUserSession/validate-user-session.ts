import { NextFunction, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { env } from "../../env";
import { StatusCodes } from "http-status-codes";

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

export default async function validateUserSession(request: Request, response: Response, next: NextFunction) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const supabaseSession = request.cookies['sb-session'];
  const cookieMaxAge = supabaseSession?.cookieMaxAge;
  const { access_token, refresh_token } = supabaseSession?.session;

  const { data: { user } } = await supabase.auth.getUser(access_token);
  
  if (!user) {
    response.status(StatusCodes.UNAUTHORIZED).json({ message: 'Usuário não autenticado.' });
    return;
  }

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token
  });

  const cookieData = {
    ...data,
    cookieMaxAge: cookieMaxAge
  }

  response.cookie(
    'sb-session',
    cookieData,
    {
      maxAge: cookieMaxAge
    }
  )

  next();
}