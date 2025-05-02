import { Request, Response } from "express";
import { UserSigninError, UserRequestLimitExceededError, UserAlreadyExistsError, UserWeakPasswordError } from "../../Classes";
import { StatusCodes } from "http-status-codes";
import { createSupabaseClient } from "../../utils/supabase/client";
import { UserProfile } from "../../Types/types";
import { env } from "../../env";


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

  static async signin(request: Request, response: Response) {
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
        is_admin: profiles.is_admin 
      };
      
      response.cookie(
        'sb-session', 
        cookieData,  
        { 
          maxAge: sessionMaxAge, 
          httpOnly: true,
          secure: env.NODE_ENV === 'production'
        }
      );
      response.status(StatusCodes.OK).json(responseData);
      
    } catch (error: any) {
      let responseStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      let responseMessage = 'Um erro interno ocorreu.'

      if(error.name === 'UserSigninError') {
        return response.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      }

      return response.status(responseStatus).json({ message: responseMessage });
    }
  }

  static async signup(request: Request, response: Response) {
    try {
      const profiles = await UsersController.fetchUser(request.body.email);

      if (profiles.length > 0) {
        throw new UserAlreadyExistsError('Usuário já cadastrado.');
      }
      
      const { data, error } = await supabase.auth.signUp({
        email: request.body.email,
        password: request.body.password
      });
  
      if (error) {
        if (error.code === 'weak_password') {
          throw new UserWeakPasswordError('A senha precisa ter, pelo menos, 8 digitos. E deve ser composta de letras e números.');
        }
        else if(error.status === StatusCodes.TOO_MANY_REQUESTS) {
          throw new UserRequestLimitExceededError('Número de requisições excedido.');
        }
      }
      
      response.status(StatusCodes.OK).json(data);
      
    } catch (error: any) {
      let responseStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      let responseMessage = 'Um erro interno ocorreu.'

      if(
        error.name === 'UserSigninError' ||
        error.name === 'UserAlreadyExistsError' ||
        error.name === 'UserWeakPasswordError' ||
        error.name === 'UserRequestLimitExceededError'
      ) {
        responseStatus = StatusCodes.BAD_REQUEST;
        responseMessage = error.message;
      }

      return response.status(responseStatus).json({ message: responseMessage });
    }
  }

  static async signout(request: Request, response: Response) {
    try {
      const { error } = await supabase.auth.signOut();
      response.clearCookie('sb-session');
      return response.status(StatusCodes.OK).json({ message: 'Usuário deslogado com sucesso.' });

    } catch (error: any) {
      let responseStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      let responseMessage = 'Um erro interno ocorreu.'

      return response.status(responseStatus).json({ message: responseMessage });
    }
  }
}