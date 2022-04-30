 
import { createLogger, format, transports, config } from 'winston';
 
const logger = createLogger({
   transports: [
       new transports.Console()
     ]
 });
 module.exports = logger;