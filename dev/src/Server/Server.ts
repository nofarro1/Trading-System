import https from 'https'
import fs from 'fs'
import {Server, Socket} from 'socket.io'
import express from "express";
import {router} from './expressApp'
import session, {Session} from "express-session";
import {Response, Request, NextFunction} from "express"

declare module "http" {
    interface IncomingMessage {
        session: Session
    }
}


export const app = express();

const sessionMiddleware = session({secret: "this is a secret", resave: false, saveUninitialized: true})
app.use(sessionMiddleware);

const keyPath = "./security/local.key"
const certPath = "./security/cert.crt"
const port = process.env.PORT || 3000;

const httpsServer = https.createServer({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
}, app)
const io: Server = new Server(httpsServer, {});


const wrap = (middleware: express.RequestHandler) =>
    (socket: Socket, next: NextFunction): void => middleware(socket.request as Request, {} as Response, next as NextFunction);


io.use(wrap(sessionMiddleware));


io.use((socket,next) => {
    const sess = socket.request.session
    if(sess){
        next();
    } else {
        next(new Error("cannot get session"))
    }
})

io.on("connection", (socket) => {
    let session = socket.request.session
    console.log(`session ${session} has connected`);
})

io.on('disconnect', (socket) => {
    let session = socket.request.session
    console.log(`session ${session} has disconnected`);
})

app.use('/api', router)

httpsServer.listen(port);


