import { NextFunction, Request, RequestHandler, Response } from "express";
import { UserSigninError, UserRequestLimitExceededError, UserAlreadyExistsError, UserWeakPasswordError } from "../../Classes";
import { StatusCodes } from "http-status-codes";
import { createSupabaseClient } from "../../utils/supabase/client";
import { UserProfile } from "../../Types/types";
import { env } from "../../env";
import { setSupabaseSessionCookie } from "../../utils/setSupabaseSessionCookie";
import { logger } from "../../utils/logger";


const supabase = createSupabaseClient();
export default class UsersController {

  private static async fetchUser(email: string): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email);

    if(error) { throw error; }
    return data as UserProfile[];
  }

  static signin: RequestHandler = async function(request: Request, response: Response, next?: NextFunction) {
    try {
      const { email, password, keep_logged_in } = request.body;

      let { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
  
      if (error) {
        if (error.status === StatusCodes.BAD_REQUEST) {
          throw new UserSigninError('Credenciais Inválidas.');
        }
      }

      let sessionMaxAge = 1000 * 3600 * 24;
      sessionMaxAge = keep_logged_in ? sessionMaxAge * 365 : sessionMaxAge * 7;

      const [ profiles ] = await UsersController.fetchUser(email);
      const cookieData = { ...data, cookieMaxAge: sessionMaxAge };
      const responseData = { 
        id: profiles.id, 
        is_admin: profiles.is_admin,
        access_token: data.session?.access_token
      };
      
      setSupabaseSessionCookie(response, cookieData, sessionMaxAge);

      logger.info(`Usuário ${email} (${profiles.id}) logado com sucesso.`);
      response.status(StatusCodes.OK).json(responseData);
      
    } catch (error: any) {
      let responseStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      let responseMessage = 'Um erro ocorreu durante o login do usuário.'

      if(error.name === 'UserSigninError') {
        responseStatus = StatusCodes.BAD_REQUEST;
        responseMessage = error.message;
      }

      response.status(responseStatus).json({ message: responseMessage });
    }
  }

  static signup: RequestHandler = async function(request: Request, response: Response, next?: NextFunction) {
    try {
      const profiles = await UsersController.fetchUser(request.body.email);

      if (profiles.length > 0) {
        throw new UserAlreadyExistsError('Usuário já cadastrado.');
      }
      
      const { email, password } = request.body;
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });
  
      if (error) {
        if (error.code === 'weak_password') {
          throw new UserWeakPasswordError('A senha precisa ter, pelo menos, 8 digitos. E deve ser composta de letras e números.');
        }
        else if(error.status === StatusCodes.TOO_MANY_REQUESTS) {
          throw new UserRequestLimitExceededError('Número de requisições excedido.');
        }
      }
      
      logger.info(`Usuário ${email} (${data?.user?.id}) registrado com sucesso.`);
      response.status(StatusCodes.OK).json(data);
      
    } catch (error: any) {
      let responseStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      let responseMessage = 'Um erro interno ocorreu durante o cadastro de usuário.'

      if(
        error.name === 'UserSigninError' ||
        error.name === 'UserAlreadyExistsError' ||
        error.name === 'UserWeakPasswordError' ||
        error.name === 'UserRequestLimitExceededError'
      ) {
        responseStatus = StatusCodes.BAD_REQUEST;
        responseMessage = error.message;
      }

      logger.error(error.message + '\n' + error);
      response.status(responseStatus).json({ message: responseMessage });
    }
  }

  static signout: RequestHandler = async function(request: Request, response: Response, next?: NextFunction) {
    try {
      const { error } = await supabase.auth.signOut();
      const supabaseSession = request.cookies["sb-session"];
      const { id, email } = supabaseSession.user;

      logger.info(`Usuário ${email} (${id}) deslogado com sucesso.`);
      response.clearCookie('sb-session');
      response.status(StatusCodes.OK).json({ message: 'Usuário deslogado com sucesso.' });

    } catch (error: any) {
      let responseStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      let responseMessage = 'Um erro interno ocorreu durante o logout do usuário.'

      logger.error(error.message + '\n' + error);
      response.status(responseStatus).json({ message: responseMessage });
    }
  }
}