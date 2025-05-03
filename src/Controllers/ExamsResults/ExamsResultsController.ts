import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DataNotFoundError, DuplicatedDataError } from "../../Classes";
import { createSupabaseClient } from "../../utils/supabase/client";


function getAccessTokenFromCookie(request: Request): string {
  return request.cookies['sb-session'].session.access_token;
}

export default class ExamsResultsController {
  
  static async createExamResult(request: Request, response: Response) {
    try {
      const access_token = getAccessTokenFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('resultados_exames')
      .insert(request.body)
      .select();

      return response.status(StatusCodes.OK).json(data);
      
    } catch (error: any) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      let message = 'Um erro interno ocorreu.';
      
      console.log(error.message);
      return response.status(statusCode).json({ message: message });
    }
  }
  
  static async updateExamResult(request: Request, response: Response) {
    try {
      const access_token = getAccessTokenFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('resultados_exames')
      .upsert(request.body)
      .select();

      response.status(StatusCodes.OK).json(data);
      
    } catch (error: any) {
      let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      let message = 'Um erro interno ocorreu.';

      console.log(error.message);
      return response.status(statusCode).json({ message: message });
    }
  }
  
  static async deleteExamResult(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const access_token = getAccessTokenFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const supabaseResponse = await supabase
      .from('resultados_exames')
      .delete()
      .eq('id', parseInt(id))
      .select();

      if(supabaseResponse.data?.length === 0) {
        throw new DataNotFoundError('Não foi possível deletar o resultado do exame. Pois ele não existe.');
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