import { Request, RequestHandler, Response } from "express";
import { exec } from 'child_process';
import fs from 'fs';
import { DietFormattingError } from "../../Classes";
import { StatusCodes } from "http-status-codes";

function format(clear: boolean = false): void {
  const CMD:string = [
    "latexmk",
    "-pdf",
    "-interaction=nonstopmode",
    "-halt-on-error",
    "-output-directory=files",
    "-jobname=dieta",
    "files/layout.tex"
  ].join(' ');
  const fullCMD = clear ? CMD + ' -gg' : CMD;
  exec(`${fullCMD}`, (error, stdout, stderr) => {
    if (error || stderr) {
      throw new DietFormattingError(error ? error.message : stderr);
    }
  });
}

export default class FormatterController {
  static formatDiet: RequestHandler = function (request: Request, response: Response) {
    fs.writeFileSync('files/teste.tex', 'Olá, mundo');

    try {
      format(true);
      format();

      response.status(StatusCodes.OK).send('Hello World!');
      return;
    } catch (error:any) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
      return;
    }
  }
}