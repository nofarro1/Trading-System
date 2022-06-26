import { PrismaClient } from '../../prisma/prisma'

let prisma = new PrismaClient()

export function createNewClient(url: string) {
    prisma = new PrismaClient({
        datasources: {
            db: {
                url: url,
            },
        },
    });
}

export default prisma