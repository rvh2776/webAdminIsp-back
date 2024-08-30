import { Request, Response, NextFunction } from 'express';

export function LoggerGlobal(req: Request, res: Response, next: NextFunction) {
  const currentDate = new Date();

  // Formatear fecha y hora en la zona horaria local
  const optionsDate = {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric' as const,
    month: '2-digit' as const,
    day: '2-digit' as const,
  };

  const optionsTime = {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour12: false,
    hour: '2-digit' as const,
    minute: '2-digit' as const,
    second: '2-digit' as const,
  };

  const formattedDate = currentDate.toLocaleDateString('en-CA', optionsDate);
  const formattedTime = currentDate.toLocaleTimeString('en-GB', optionsTime);

  console.log(
    `Está ejecutando un método ${req.method} en la ruta ${req.url} ${formattedDate} ${formattedTime} `,
  );
  next();
}
