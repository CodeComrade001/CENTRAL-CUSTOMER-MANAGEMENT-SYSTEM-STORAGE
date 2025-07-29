import { Request, Response, NextFunction } from 'express';

export function limitPayload(maxBytes: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > maxBytes) {
      res.status(413).json({ message: 'Payload Too Large' });
    } else {
      next();
    }
  };
}
