import https from 'https'
import fs from 'fs'
import io from 'socket.io'
import {app} from './expressApp'
import {Session} from "express-session";

declare module "http" {
    interface IncomingMessage {
        session: Session
    }
}

//express set up

const keyPath = "F:\\Repositories\\Trading-System\\dev\\src\\Server\\security\\local.key"
const certPath = "F:\\Repositories\\Trading-System\\dev\\src\\Server\\security\\cert.crt"
const port = process.env.PORT || 3000;


//https setup
export const httpsServer = https.createServer({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
}, app)


//socket.IO setup
export const ioServer = new io.Server()
ioServer.listen(httpsServer)

// const wrap = (middleware: express.RequestHandler) =>
//     (socket: Socket, next: NextFunction): void => middleware(socket.request as Request, {} as Response, next as NextFunction);
//
// io.use(wrap(sessionMiddleware));


// io.use((socket,next) => {
//     const sess = socket.request.session
//     if(sess){
//         next();
//     } else {
//         next(new Error("cannot get session"))
//     }
// })
// httpsServer.on('connection',(socket)=>{
//     console.log(`session  has connected`);
// })

httpsServer.on('connect', (req)=>{
    console.log(req.session.id);
})


httpsServer.listen(port, () => {
    console.log("server started. listening on port " + port)
});
