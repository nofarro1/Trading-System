import { PrismaClient } from '../../prisma/prisma'
import {logger} from "../helpers/logger";

let prisma = new PrismaClient()

export function createNewClient(url: string) {
    try{
        prisma = new PrismaClient({
            datasources: {
                db: {
                    url: url,
                },
            },
        });
    } catch(err){
        logger.error("failed to init database connection")
    }

}

export default prisma