import https from 'https'
import fs from 'fs'
import io, {Socket} from 'socket.io'
import {app, sessionMiddleware} from './expressApp'
import  {Session} from "express-session";
import express, {Express, NextFunction, Request, Response} from "express";
import {Service} from "../service/Service";

declare module "http" {
    interface IncomingMessage {
        session: Session
    }
}
const keyPath = "F:\\Repositories\\Trading-System\\dev\\src\\Server\\security\\local.key"
const certPath = "F:\\Repositories\\Trading-System\\dev\\src\\Server\\security\\cert.crt"
const port = process.env.PORT || 3000;


const wrap = (middleware: express.RequestHandler) =>
    (socket: Socket, next: NextFunction): void => middleware(socket.request as Request, {} as Response, next as NextFunction);

export class Server {
    private readonly httpsServer: https.Server
    private backendService: Service


    constructor(app:Express, service:Service){
        this.backendService = service;
        this.httpsServer = https.createServer({
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        }, app)

    }

    start(){
        const ioServer = new io.Server()
        ioServer.listen(this.httpsServer)
        ioServer.use(wrap(sessionMiddleware));
        // this.httpsServer.on('connect', (req)=>{
        //     console.log(`client with session ${req.session.id} connected`);
        //     req.socket.on('close', () => {
        //         console.log(`client with session ${req.session.id} disconnect`);
        //     })
        // })


        this.httpsServer.listen(port, () => {
            console.log("server started. listening on port " + port)
        });
    }

}



