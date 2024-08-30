import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DateTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const oldSend = res.send;

    res.send = function (...args: any[]) {
      const data = args[0];
      if (typeof data === 'string') {
        try {
          let json = JSON.parse(data);
          if (Array.isArray(json)) {
            json = json.map((item) => formatDates(item));
          } else {
            json = formatDates(json);
          }
          args[0] = JSON.stringify(json);
        } catch (e) {
          // Do nothing if JSON parse fails
        }
      }
      return oldSend.apply(res, args);
    };

    function formatDates(obj: any) {
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (obj.hasOwnProperty(key) && obj[key] instanceof Date) {
            const currentDate = new Date(obj[key]);
            obj[key] = currentDate.toLocaleString('en-CA', {
              timeZone: 'America/Argentina/Buenos_Aires',
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            });
          } else if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
            obj[key] = formatDates(obj[key]);
          }
        }
      }
      return obj;
    }

    next();
  }
}
