import { validationResult } from 'express-validator';

export function validateRequest(req, _res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return next({
    statusCode: 422,
    message: 'Usuário ou senha invalido.',
    details: errors.array(),
  });
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Erro interno do servidor' : err.message;

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: message,
    ...(err.details ? { details: err.details } : {}),
  });
}
