// middlewares/requestLogger.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';

export default function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
};
