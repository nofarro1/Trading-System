import https from 'https'
import fs from 'fs'
import io, {Socket} from 'socket.io';
import {sessionMiddleware} from './expressApp'
import {Session} from "express-session";
import express, {Express, NextFunction, Request, Response} from "express";
import {Service} from "../service/Service";
import {SimpleMessage} from "../domain/notifications/Message";
import {LiveNotificationSubscriber, NotificationService} from "../service/NotificationService";
import {logger} from "../helpers/logger"

declare module "express-session" {
    interface Session {
        username: string;
        loggedIn: boolean;
        sessionSubscriber?:LiveNotificationSubscriber;
    }
}

declare module "http" {
    interface IncomingMessage {
        session: Session
    }
}


const keyPath = __dirname + "/security/key.pem";
const certPath = __dirname + "/security/cert.pem";
const port = process.env.PORT || 3000;


const wrap = (middleware: express.RequestHandler) =>
    (socket: Socket, next: NextFunction): void => middleware(socket.request as Request, {} as Response, next as NextFunction);




export class Server {
    private readonly httpsServer: https.Server
    private backendService: Service;
    private ioServer: io.Server;
    private notificationService: NotificationService;


    constructor(app: Express, service: Service,
                notificationService: NotificationService) {
        this.backendService = service;
        this.notificationService = notificationService;
        this.httpsServer = https.createServer({
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
            rejectUnauthorized: false
        }, app)
        logger.info("https Server is initialized")
        this.ioServer = new io.Server(this.httpsServer, {
            cors: {origin: "*/*"}
        })
        this.ioServer.listen(this.httpsServer)
        this.ioServer.use(wrap(sessionMiddleware));
        logger.info("WebSocketServer is initialized")
    }

    start() {
        this.setupEvents()
        this.httpsServer.listen(port, () => {
            console.log("server started. listening on port " + port)
        });
    }

    shutdown() {
        this.httpsServer.close(() => console.log("server is down"));
    }

    private setupEvents() {
        logger.info("setting up socketIO live notification event")
        this.setupConnectionEvent();
        this.setupDisconnectEvent();
    }

    private setupDisconnectEvent() {
        this.ioServer.on('disconnect', (socket) => {
            //todo: try to wait for reconnection
            const session = socket.session;
            if (session.loggedIn && session.sessionSubscriber) {
                this.notificationService.unsubscribeToBox(session.sessionSubscriber).then(() => {
                    console.log("live notification subscription success");
                });
            }
        })
    }

    private setupConnectionEvent(){
        this.ioServer.on('connection', (socket) => {
            logger.info("got new connection with" + socket.request.session.id);
            let session = socket.request.session;
            //check if this session is logged in
            if (session.loggedIn) {
                session.sessionSubscriber = new LiveNotificationSubscriber(socket);
                this.notificationService.subscribeToBox(session.sessionSubscriber).then(()=>{
                    console.log("live notification subscription success");
                });
                this.setupGeneralMessageEvent(socket);
            }
        })
    }

    private setupGeneralMessageEvent(socket: Socket){
        socket.on('simpleMessage', (simpleMessage:SimpleMessage) => {
            this.notificationService.sendMessage(simpleMessage);
        })
    }

}



