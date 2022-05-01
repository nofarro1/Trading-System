 
import { createLogger, format, transports, config } from 'winston';
 
export const logger = createLogger({
   transports: [
       new transports.Console()
     ]
 });