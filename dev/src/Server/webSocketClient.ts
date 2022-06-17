
import {io, Socket} from 'socket.io-client'
import {SimpleMessage} from "../domain/notifications/Message";

export class LiveNotificationClient {
    get ioClient(): Socket {
        return this._ioClient;
    }

    private _ioClient: Socket;

    constructor(address?: string) {
        this._ioClient = io(address,{rejectUnauthorized:false})

        this._ioClient.on('connection', (socket:Socket)=>{
            console.log("connection to server established")
        });

        // this._ioClient.on('NewMessages', (socket:Socket)=>{
        //     console.log("received new message from server");
        // })

        this._ioClient.on('disconnect', ()=>{
            console.log("live notification disabled")
        })

    }

    get connected(): boolean {
        return this._ioClient.connected
    }

    connect(){
        this._ioClient.connect()
    }

    disconnect(){
        this._ioClient.disconnect();
    }
    //newMessages
    registerCallbackForServerEvent(event:string, callback:(socket:Socket)=>void):void{
        this._ioClient.on(event,callback);
    }

    sendMessage(event:string, data:SimpleMessage){
       this._ioClient.emit(event,data);
    }
}