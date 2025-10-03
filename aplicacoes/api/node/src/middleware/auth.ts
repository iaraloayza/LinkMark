import { Request, Response, NextFunction } from 'express';

// Extendendo a interface Request para incluir userId
export interface AuthRequest extends Request {
  userId?: number;
}

/**
 * Middleware de autenticação simples
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const userId = req.headers['x-user-id'] as string;

  if (!userId || isNaN(Number(userId))) {
    res.status(401).json({
      success: false,
      error: 'Não autenticado. Faça login primeiro.'
    });
    return;
  }

  req.userId = Number(userId);
  next();
};