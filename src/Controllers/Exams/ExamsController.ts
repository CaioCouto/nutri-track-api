import { createClient } from "@supabase/supabase-js";
import { Request, Response } from "express";
import { env } from '../../env';
import { UserSigninError, UserRequestLimitExceededError, UserAlreadyExistsError, DataNotFoundError } from "../../Classes";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;

export default class ExamsController {
  
  static async getAll(request: Request, response: Response) {
    try {
      const access_token = request.cookies['sb-session'].session.access_token;
      const supabase = createClient(
        SUPABASE_URL, 
        SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        }
      );

      const { data, error } = await supabase
      .from('exames')
      .select('*, resultados_exames(*)');

      if(!data || data?.length === 0) {
        throw new DataNotFoundError('Dados não existem.');
      }

      response.json(data);
      
    } catch (error: any) {
      let responseStatus = StatusCodes.INTERNAL_SERVER_ERROR;
      let responseMessage = 'Um erro interno ocorreu.'

      if(error.name === 'DataNotFoundError') {
        return response.status(StatusCodes.NOT_FOUND).json({ message: error.message });
      }

      return response.status(responseStatus).json({ message: responseMessage });
    }
  }
  
  static async getExamById(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const access_token = request.cookies.jwt;
      const supabase = createClient(
        SUPABASE_URL, 
        SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        }
      );

      const { data, error } = await supabase
      .from('exames')
      .select('*, resultados_exames(*)')
      .eq('id', id);

      if(!data || data?.length === 0) {
        throw new DataNotFoundError('Dados não existem.');
      }

      response.json(data);
      
    } catch (error: any) {
      if(error.name === 'DataNotFoundError') {
        return response.status(404).json({ message: error.message });
      }
      console.log(error.message);
      return response.status(500).json({ message: 'Um erro interno ocorreu.' });
    }
  }
  
  static async createExam(request: Request, response: Response) {
    try {
      const { nome, unidade } = request.body;
      const access_token = request.cookies.jwt;
      const supabase = createClient(
        SUPABASE_URL, 
        SUPABASE_ANON_KEY,
        {
          global: {
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        }
      );

      const { data, error } = await supabase
      .from('exames')
      .insert({
        nome: nome,
        unidade: unidade
      })
      .select();

      console.log(error);

      // if(!data || data?.length === 0) {
      //   throw new DataNotFoundError('Dados não existem.');
      // }

      response.json({'data': 'ok'});
      
    } catch (error: any) {
      if(error.name === 'DataNotFoundError') {
        return response.status(404).json({ message: error.message });
      }
      console.log(error.message);
      return response.status(500).json({ message: 'Um erro interno ocorreu.' });
    }
  }
}