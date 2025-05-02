import { Request, Response } from "express";
import { exec } from 'child_process';
import fs from 'fs';
import { DietFormattingError } from "../../Classes";

interface IFormatFnReturnObject {
  message: string
  error: boolean
}

export default class FormatterController {
  private static CMD:string = [
      "latexmk",
      "-pdf",
      "-interaction=nonstopmode",
      "-halt-on-error",
      "-output-directory=files",
      "-jobname=dieta",
      "files/layout.tex"
    ].join(' ');

  private static format(clear: boolean = false): void {
    const fullCMD = clear ? this.CMD + ' -gg' : this.CMD;
    let returnError = false, returnMessage = '';
    exec(`${fullCMD}`, (error, stdout, stderr) => {
      if (error || stderr) {
        throw new DietFormattingError(error ? error.message : stderr);
      }
    });
  }

  static formatDiet(request: Request, response: Response) {
    fs.writeFileSync('files/teste.tex', 'Olá, mundo');

    try {
      this.format(true);
      this.format();

      return response.send('Hello World!');
    } catch (error:any) {
      return response.status(500).send(error.message);
    }
  }
}