import { Response } from 'express';

/**
 * Utility to standardize error responses and reduce boilerplate in controllers.
 * Logs the original error to the console and sends a JSON payload with a
 * generic message (avoiding internal details leaking to clients).
 */
export function handleError(res: Response, message: string, err?: any, status = 500) {
  // Always log full error server-side for debugging
  if (err) console.error(message, err);
  else console.error(message);
  return res.status(status).json({ error: message });
}
