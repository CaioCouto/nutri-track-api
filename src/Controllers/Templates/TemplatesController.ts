import { NextFunction, Request, Response } from "express";
import path from 'path';
import { getTemplatesDir } from "../../utils/getTemplatesDir";


export default class TemplatesController {
  static async serve(req: Request, res: Response, next: NextFunction) {
    res.sendFile(path.join(getTemplatesDir(), 'index.html'));
  }
};