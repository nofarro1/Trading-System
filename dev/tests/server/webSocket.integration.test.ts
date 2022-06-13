import {Server} from "../../src/Server/Server";
import request from "supertest";
import {mockDependencies, mockInstance, mockMethod} from "../mockHelper";
import {Service} from "../../src/service/Service";
import {Result} from "../../src/utilities/Result";
import {app} from "../../src/Server/expressApp";
import {systemContainer} from "../../src/helpers/inversify.config";
import {TYPES} from "../../src/helpers/types";

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
    let activeSession: string;
    let shopId: number;
    let productId: number;


    beforeAll((done) => {
        server = new Server(app, systemContainer.get(TYPES.Service), systemContainer.get(TYPES.NotificationService));
        server.start()
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = String(0); //allow self-signed certificate
        agent = request.agent(app)
        done()
        //access the marketplace before each test
        agent.get("/access").send().then((res) => {
            activeSession = res.body.data._guestID;
            console.log("requested new session")
            done();
        })

    })


})