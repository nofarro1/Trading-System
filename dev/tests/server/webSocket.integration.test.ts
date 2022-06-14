import {Server} from "../../src/Server/Server";
import request from "supertest";
import {mockDependencies, mockInstance, mockMethod} from "../mockHelper";
import {Service} from "../../src/service/Service";
import {Result} from "../../src/utilities/Result";
import {app} from "../../src/Server/expressApp";
import {systemContainer} from "../../src/helpers/inversify.config";
import {TYPES} from "../../src/helpers/types";
import {LiveNotificationClient} from "../../src/Server/webSocketClient";
import {SimpleMember} from "../../src/utilities/simple_objects/user/SimpleMember";
import {LiveNotificationSubscriber, NotificationService} from "../../src/service/NotificationService";
import {Socket} from "socket.io";
import {Message, SimpleMessage} from "../../src/domain/notifications/Message";
import {MessageController} from "../../src/domain/notifications/MessageController";

jest.setTimeout(50000)
let server: Server
const baseUrl = "https://localhost:3000"
let agent: request.SuperAgentTest;
let serviceMockMethod: jest.SpyInstance<any, unknown[]>;

const mockServiceMethod = <T>(method: string, data: T) => {
    return mockMethod(Service.prototype, method, () => {
        return Promise.resolve(new Result(true, data, undefined));
    })
}

describe("websockets tests - basic actions", () => {
    mockInstance(mockDependencies.Service);
    mockInstance(mockDependencies.MessageController);
    let client:LiveNotificationClient;
    const simpleMessage: Message = new SimpleMessage(new Set<string>(["hi"]))
    let serverEventPusher:LiveNotificationSubscriber;

    beforeAll(async () => {
        server = new Server(app, systemContainer.get(TYPES.Service), systemContainer.get(TYPES.NotificationService));
        server.start()
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = String(0); //allow self-signed certificate
        agent = request.agent(app)
        mockServiceMethod('login', new SimpleMember("myusername"));
        mockMethod(MessageController.prototype, 'addSubscriberToBox', (username:string ,sub:LiveNotificationSubscriber) => {
            serverEventPusher = sub
            return Result.Ok(undefined);
        })
       let res = await agent.post("/api/guest/login").send({
            username: "myusername",
            password: "12345678"
        });
        client = new LiveNotificationClient(`https://localhost:3000`);

        //access the marketplace before each test


    })

    test("connect to server", (done)=> {
      client.registerCallbackForServerEvent("connect",()=>{
          expect(client.connected).toBe(true);
          done()
      })
        client.connect()

    })

    test("connect test to socketIO", (done)=>{
        client.registerCallbackForServerEvent('NewMessages', (arg)=> {
            expect(arg).toBe([simpleMessage]);
            done()
        })
        serverEventPusher.onNewMessages([simpleMessage])

    })

    test("disconnect test", (done)=>{
        client.registerCallbackForServerEvent('disconnect',()=>{
            expect(client.connected).toBe(false)
            done()
        })
        client.disconnect()
    })

    afterAll(()=>{
        server.shutdown()
    })


})