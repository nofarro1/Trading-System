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
import {SimpleMessage} from "../../src/domain/notifications/Message";

jest.setTimeout(50000)
let server: Server
const baseUrl = "https://localhost:3000"
let agent: request.SuperAgentTest;
let serviceMockMethod: jest.SpyInstance<any, unknown[]>;

const mockServiceMethod = <T>(method: string, data: T) => {
    return mockMethod(Service.prototype, method, () => {
        return new Result(true, data, undefined);
    })
}

describe("websockets tests - basic actions", () => {
    mockInstance(mockDependencies.Service);
    mockInstance(mockDependencies.NotificationService);
    let activeSession: string;
    let shopId: number;
    let productId: number;
    let client:LiveNotificationClient;
    const simpleMessage = new SimpleMessage(new Set<string>(["hi"]))

    beforeAll(async (done) => {
        server = new Server(app, systemContainer.get(TYPES.Service), systemContainer.get(TYPES.NotificationService));
        server.start()
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = String(0); //allow self-signed certificate
        agent = request.agent(app)
        mockServiceMethod('login', new SimpleMember("myusername"));
        await agent.post("/api/login").send({
            username: "myusername",
            password: "12345678"
        });
        let serverEventPusher:LiveNotificationSubscriber;
        mockMethod(NotificationService.prototype, 'subscribeToBox', (socket:Socket) => {
            serverEventPusher = new LiveNotificationSubscriber(socket)
            return Promise.resolve(Result.Ok("OK"));
        })
        //access the marketplace before each test

        done();
    })

    afterEach(()=> client.disconnect())

    test("connect test to socketIO", ()=>{
        client = new LiveNotificationClient(`https://localhost:3000`);
        client.registerCallbackForServerEvent('NewMessages', (arg)=> {
            expect(arg).toBe([simpleMessage])
        })
    })


})