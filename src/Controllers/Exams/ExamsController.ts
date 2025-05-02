import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DataNotFoundError, DuplicatedDataError } from "../../Classes";
import { createSupabaseClient } from "../../utils/supabase/client";


function getAccessTokenFromCookie(request: Request): string {
  return request.cookies['sb-session'].session.access_token;
}

export default class ExamsController {
  
  static async getAll(request: Request, response: Response) {
    try {
      const access_token = getAccessTokenFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('exames')
      .select('*, resultados_exames(*)');

      if(!data || data?.length === 0) {
        throw new DataNotFoundError('Dados não existem.');
      }

      response.json(data);
      
    } catch (error: any) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      let message = 'Um erro interno ocorreu.'

      if(error.name === 'DataNotFoundError') {
        statusCode = StatusCodes.NOT_FOUND;
        message = error.message;
      }

      console.log(error.message);
      return response.status(statusCode).json({ message: message });
    }
  }
  
  static async getExamById(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const access_token = getAccessTokenFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('exames')
      .select('*, resultados_exames(*)')
      .eq('id', parseInt(id));

      if(!data || data?.length === 0) {
        throw new DataNotFoundError('Dados não existem.');
      }

      response.json(data);
      
    } catch (error: any) {      
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      let message = 'Um erro interno ocorreu.';

      if(error.name === 'DataNotFoundError') {
        statusCode = StatusCodes.NOT_FOUND;
        message = error.message;
      }
      console.log(error.message);
      return response.status(statusCode).json({ message: message });
    }
  }
  
  static async createExam(request: Request, response: Response) {
    try {
      const { nome, unidade } = request.body;
      const access_token = getAccessTokenFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('exames')
      .insert({
        nome: nome,
        unidade: unidade
      })
      .select();

      if(error) {
        if(error.code === '23505') {
          throw new DuplicatedDataError('Exame já cadastrado.');
        }
      }

      response.json(data);
      
    } catch (error: any) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      let message = 'Um erro interno ocorreu.';

      if(error.name === 'DataNotFoundError') {
        statusCode = StatusCodes.NOT_FOUND;
        message = error.message;
      }
      else if(error.name === 'DuplicatedDataError') {
        statusCode = StatusCodes.CONFLICT;
        message = error.message;
      }
      console.log(error.message);
      return response.status(statusCode).json({ message: message });
    }
  }
  
  static async deleteExam(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const access_token = getAccessTokenFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const supabaseResponse = await supabase
      .from('exames')
      .delete()
      .eq('id', parseInt(id))
      .select();

      if(supabaseResponse.data?.length === 0) {
        throw new DataNotFoundError('Não foi possível deletar o exame. Pois ele não existe.');
      }

      response.status(StatusCodes.OK).json(supabaseResponse.data);
      
    } catch (error: any) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      let message = 'Um erro interno ocorreu.';

      if(error.name === 'DataNotFoundError') {
        statusCode = StatusCodes.NOT_FOUND;
        message = error.message;
      }

      console.log(error.message);
      return response.status(statusCode).json({ message: message });
    }
  }
}