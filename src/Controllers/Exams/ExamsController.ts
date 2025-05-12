import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DataNotFoundError, DuplicatedDataError } from "../../Classes";
import { createSupabaseClient } from "../../utils/supabase/client";
import { redis } from "../../utils/redis/client";


function getAccessTokenFromCookie(request: Request): string {
  return request.cookies['sb-session'].session.access_token;
}

export default class ExamsController {
  
  static getAll: RequestHandler = async function (request: Request, response: Response) {
    try {
      const redisCache = await redis.get('all-exams');

      if(redisCache) {
        response.json(JSON.parse(redisCache));
        return;
      }

      const access_token = getAccessTokenFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('exames')
      .select('*, resultados_exames!resultados_exames_exame_id_fkey(*)')
      .order('nome', { ascending: true });

      if(!data || data?.length === 0) {
        throw new DataNotFoundError('Dados não existem.');
      }

      await redis.set('all-exams', JSON.stringify(data), 'EX', 600);

      response.json(data);
      
    } catch (error: any) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      let message = 'Um erro interno ocorreu.'

      if(error.name === 'DataNotFoundError') {
        statusCode = StatusCodes.NOT_FOUND;
        message = error.message;
      }

      console.log(error.message);
      response.status(statusCode).json({ message: message });
    }
  }
  
  static getExamById: RequestHandler = async function (request: Request, response: Response) {
    try {
      const { id } = request.params;
      const access_token = getAccessTokenFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('exames')
      .select('*, resultados_exames!resultados_exames_exame_id_fkey(*)')
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
      response.status(statusCode).json({ message: message });
    }
  }
  
  static createExam: RequestHandler = async function (request: Request, response: Response) {
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

      redis.del('all-exams');
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
      response.status(statusCode).json({ message: message });
    }
  }
  
  static updateExam: RequestHandler = async function (request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { nome, unidade } = request.body;
      const access_token = getAccessTokenFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('exames')
      .update({ nome: nome, unidade: unidade })
      .eq('id', parseInt(id))
      .select();

      if(error) {
        throw new DataNotFoundError('Não foi possível deletar o exame. Pois ele não existe.');
      }

      redis.del('all-exams');
      response.status(StatusCodes.OK).json(data);
      return;
      
    } catch (error: any) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      let message = 'Um erro interno ocorreu.';

      if(error.name === 'DataNotFoundError') {
        statusCode = StatusCodes.NOT_FOUND;
        message = error.message;
      }

      console.log(error.message);
      response.status(statusCode).json({ message: message });
      return;
    }
  }
  
  static deleteExam: RequestHandler = async function (request: Request, response: Response) {
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

      redis.del('all-exams');
      response.status(StatusCodes.OK).json(supabaseResponse.data);
      return;
    } catch (error: any) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      let message = 'Um erro interno ocorreu.';

      if(error.name === 'DataNotFoundError') {
        statusCode = StatusCodes.NOT_FOUND;
        message = error.message;
      }

      console.log(error.message);
      response.status(statusCode).json({ message: message });
    }
  }
}