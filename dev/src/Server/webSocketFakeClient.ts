
import {io, Socket} from 'socket.io-client'

class LiveNotificationClient {
    private ioClient: Socket;


    constructor() {
        this.ioClient = io()

        this.ioClient.on('connection', (socket:Socket)=>{
            console.log("connection to server established")
        });

        this.ioClient.on('NewMessage', (socket:Socket)=>{
            console.log("received new message from server");
        })

        this.ioClient.on('disconnect', ()=>{
            console.log("live notification disabled")
        })

    }

    registerCallbackForEvent(event:string, callback:(socket:Socket)=>void):void{
        this.ioClient.on(event,callback);
    }
}