
import {io, Socket} from 'socket.io-client'
import {SimpleMessage} from "../domain/notifications/Message";

class LiveNotificationClient {
    private ioClient: Socket;


    constructor() {
        this.ioClient = io({rejectUnauthorized:false})

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

    registerCallbackForServerEvent(event:string, callback:(socket:Socket)=>void):void{
        this.ioClient.on(event,callback);
    }

    sendMessage(event:string, data:SimpleMessage){
       this.ioClient.emit(event,data);
    }
}