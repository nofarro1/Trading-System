
import {io, Socket} from 'socket.io-client'
import {SimpleMessage} from "../domain/notifications/Message";

export class LiveNotificationClient {
    private ioClient: Socket;


    constructor(address?: string) {
        this.ioClient = io(address,{rejectUnauthorized:false})

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

    connect(){
        this.ioClient.connect()
    }

    disconnect(){
        this.ioClient.disconnect();
    }
    //newMessages
    registerCallbackForServerEvent(event:string, callback:(socket:Socket)=>void):void{
        this.ioClient.on(event,callback);
    }

    sendMessage(event:string, data:SimpleMessage){
       this.ioClient.emit(event,data);
    }
}