import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { DataNotFoundError, DuplicatedDataError } from "../../Classes";
import { createSupabaseClient } from "../../utils/supabase/client";
import { redis } from "../../utils/redis/client";
import { Patient } from "../../Types/types";
import { convertDateToISOString } from "../../utils/convertDateToISOString";

interface IUserData {
  userId: string;
  access_token: string;
}

function getUserDataFromCookie(request: Request): IUserData {
  const session = request.cookies['sb-session'];
  
  return {
    userId: session.user.id,
    access_token: session.session.access_token
  };
}

export default class PatientsController {
  
  static getAll: RequestHandler = async function (request: Request, response: Response, next?: NextFunction) {
    try {
      const redisCache = await redis.get('all-patients');

      if(redisCache) {
        response.json(JSON.parse(redisCache));
        return;
      }

      const { userId, access_token} = getUserDataFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('pacientes')
      .select('*')
      .eq('profile_id', userId);

      if(!data || data?.length === 0) {
        throw new DataNotFoundError('Dados não existem.');
      }

      await redis.set('all-patients', JSON.stringify(data), 'EX', 600);

      response.status(StatusCodes.OK).json(data);
      
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
  
  static getPatientById: RequestHandler = async function (request: Request, response: Response, next?: NextFunction) {
    try {
      const { id } = request.params;
      const { userId, access_token} = getUserDataFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('pacientes')
      .select('*, resultados_pacientes(*, exames(*))')
      .eq('id', parseInt(id));

      if(!data || data?.length === 0) {
        throw new DataNotFoundError('Dados não existem.');
      }

      response.status(StatusCodes.OK).json(data);
      
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
  
  static createPatient: RequestHandler = async function (request: Request, response: Response, next?: NextFunction) {
    try {
      const { nome, data_nascimento, sexo } = request.body as Patient;
      const { userId, access_token } = getUserDataFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('pacientes')
      .insert({
        nome: nome,
        data_nascimento: convertDateToISOString(new Date(data_nascimento)),
        sexo: sexo,
        profile_id: userId
      })
      .select();

      console.log(error);

      if(error) {
        if(error.code === '23505') {
          throw new DuplicatedDataError('Paciente já cadastrado.');
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
      response.status(statusCode).json({ message: message });
    }
  }
  
  static updatePatient: RequestHandler = async function (request: Request, response: Response, next?: NextFunction) {
    try {
      const { id } = request.params;
      const { nome, data_nascimento, sexo } = request.body;
      const { userId, access_token } = getUserDataFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const { data, error } = await supabase
      .from('pacientes')
      .update({
        nome: nome,
        data_nascimento: convertDateToISOString(new Date(data_nascimento)),
        sexo: sexo,
        profile_id: userId
      })
      .eq('id', parseInt(id))
      .select();

      console.log(error);

      if(error) {
        throw new DataNotFoundError('Não foi possível atualizar o paciente. Pois ele não existe.');
      }

      response.status(StatusCodes.OK).json(data);
      
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
  
  static deletePatient: RequestHandler = async function (request: Request, response: Response, next?: NextFunction) {
    try {
      const { id } = request.params;
      const { userId, access_token } = getUserDataFromCookie(request);
      const supabase = createSupabaseClient(access_token);

      const supabaseResponse = await supabase
      .from('pacientes')
      .delete()
      .eq('id', parseInt(id))
      .select();

      if(supabaseResponse.data?.length === 0) {
        throw new DataNotFoundError('Não foi possível deletar o paciente, pois ele não existe.');
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
      response.status(statusCode).json({ message: message });
    }
  }
}