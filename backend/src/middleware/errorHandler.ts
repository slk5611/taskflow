import { Request, Response, NextFunction } from 'express';

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[Middleware] Error:', error);
  
  res.status(error.status || 500).json({
    error: error.message || 'Internal server error',
    status: error.status || 500,
  });
}

/**
 * Request logging middleware
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });
  
  next();
}
