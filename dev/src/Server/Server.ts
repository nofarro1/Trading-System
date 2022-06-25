import https from 'https'
import fs from 'fs'
import io, {Socket} from 'socket.io';
import {sessionMiddleware} from './expressApp'
import express, {Express, NextFunction, Request, Response} from "express";
import {Service} from "../service/Service";
import {SimpleMessage} from "../domain/notifications/Message";
import {LiveNotificationSubscriber, NotificationService} from "../service/NotificationService";
import {logger} from "../helpers/logger"
import config from "../config";
import {Session} from 'inspector';


// declare module "express-session" {
//     interface Session {
//         username: string;
//         loggedIn: boolean;
//         sessionSubscriber?:LiveNotificationSubscriber;
//     }
// }
//
// declare module "http" {
//     interface IncomingMessage {
//         session: Session
//         username: string;
//         loggedIn: boolean;
//     }
// }

declare module "express-session" {
    interface Session {
        username: string;
        loggedIn: boolean;
        sessionSubscriber?: LiveNotificationSubscriber;
    }
}

// declare module "http" {
//   interface IncomingMessage {
//     session: Session;
//   }
// }

const keyPath = __dirname + "/security/key.pem";
const certPath = __dirname + "/security/cert.pem";
const port = process.env.PORT || config.app.port;

const wrap = (middleware: express.RequestHandler) =>
    (socket: Socket, next: NextFunction): void => middleware(socket.request as Request, {} as Response, next as NextFunction);


export class Server {
    private readonly httpsServer: https.Server
    private backendService: Service;
    private ioServer: io.Server;
    private notificationService: NotificationService;


    constructor(bundle: {
        app: Express, service: Service,
        notificationService: NotificationService
    }) {
        this.backendService = bundle.service;
        this.notificationService = bundle.notificationService;
        this.httpsServer = https.createServer({
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
            rejectUnauthorized: false
        }, bundle.app)
        logger.info("https Server is initialized")
        this.ioServer = new io.Server(this.httpsServer, {
            cors: {origin: "*/*"}
        })
        this.ioServer.listen(this.httpsServer)
        this.ioServer.use(wrap(sessionMiddleware));
        logger.info("WebSocketServer is initialized")
    }

    start() {
        this.setupEvents();
        const listen = () => this.httpsServer.listen(port, () => {
            logger.info("server started. listening on port " + port)
        });
        if (config.env === 'dev') {
            listen();
        } else {
            this.backendService.stateInit
                .initialize()
                .then(() => listen())
                .catch(() => {
                logger.error("was unable to initialize data to the system");
                listen();
            });
        }

    }

    shutdown() {
        this.httpsServer.close(() => logger.info("server is down"));
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
            this.notificationService.unsubscribeToBox(session.sessionSubscriber).then(() => {
                console.log("live notification subscription success");
            });
        })
    }

    private setupConnectionEvent() {
        this.ioServer.on('connection', (socket: Socket) => {
            logger.info("got new connection with " + socket.request.session.id);
            //check if this session is logged in
            let sub = new LiveNotificationSubscriber(socket);
            this.notificationService.subscribeToBox(sub).then(() => {
                logger.info(`live notification enabled for session ${socket.request.session.id}`);
            });
            this.setupGeneralMessageEvent(socket);

        })
    }

    private setupGeneralMessageEvent(socket: Socket) {
        socket.on('simpleMessage', (simpleMessage: SimpleMessage) => {
            this.notificationService.sendMessage(simpleMessage);
        })
    }

}
