import { NextFunction, Request, Response } from "express";
import { env } from "../../env";
import { StatusCodes } from "http-status-codes";
import { setSupabaseSessionCookie } from "../../utils/setSupabaseSessionCookie";
import { createSupabaseClient } from "../../utils/supabase/client";
import { UserNotAuthorized } from "../../Classes";
import { logger } from "../../utils/logger";

export default async function validateUserSession(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    const supabase = createSupabaseClient();
    const supabaseSession = request.cookies["sb-session"];

    if (!supabaseSession || !supabaseSession.session) {
      throw new UserNotAuthorized("Sessão ausente ou malformada no cookie. Sessão inválida ou expirada.");
    }

    const { access_token, refresh_token } = supabaseSession.session;
    const cookieMaxAge = supabaseSession.cookieMaxAge;

    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(access_token);

    if (getUserError || !user) {
      throw new UserNotAuthorized("Usuário não autenticado.");
    }

    const { data, error: setSessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (setSessionError) {
      throw new UserNotAuthorized("Falha ao renovar sessão.");
    }

    const cookieData = {
      ...data,
      cookieMaxAge,
    };
    
    setSupabaseSessionCookie(response, cookieData, cookieMaxAge);

    next();
  } catch (error: any) {
    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let message = "Erro inesperado no middleware de sessão:";

    if (error.name === 'UserNotAuthorized') {
      statusCode = StatusCodes.UNAUTHORIZED;
      message = error.message;
    }
    
    logger.error(error.message + '\n' + error);
    response
      .status(statusCode)
      .json({ message: message });
  }
}
