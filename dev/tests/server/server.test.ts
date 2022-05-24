import {app} from "../../src/Server/expressApp"
import {Server} from "../../src/Server/Server"
import request, {agent, Response} from "supertest"

const session = require("supertest-session")
import {systemContainer} from "../../src/helpers/inversify.config";
import {TYPES} from "../../src/helpers/types";
import supertest from "supertest";


jest.setTimeout(50000)
let server: Server
const baseUrl = "https://localhost:3000"


describe("networking tests", () => {
    let activeSession: string;

    beforeAll(() => {
        server = new Server(app, systemContainer.get(TYPES.Service));
        server.start()
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = String(0); //allow self-signed certificate

    })

    afterAll(() => {
        server.shutdown()
    })

    beforeEach((done) => {
        //access the marketplace before each test
        request(baseUrl).get("/").end((err, res) => {
            activeSession = res.body.data._guestID;
            done()
        })
    })

    const getRequest = (path: string, expectedStatus: number, testBody: (body: any) => void): void => {
        const res = request(baseUrl).get(path)
        res.cookies = activeSession
        res.then((response: Response) => {
            expect(response.status).toBe(expectedStatus)
            testBody(response.body);
        })
    }

    const postRequest = (path: string, expectedStatus: number, body: any, testBody: (body: any) => void): void => {
        const res = request(baseUrl).post(path).set("accept", "application/json")
        res.cookies = activeSession
        res.send(body).then((response: Response) => {
            expect(response.status).toBe(expectedStatus)
            testBody(response.body);
        })
    }

    const patchRequest = (path: string, expectedStatus: number, body: any, testBody: (body: any) => void): void => {
        request(baseUrl).patch(path).set("accept", "application/json").send(body).then((response: Response) => {
            expect(response.status).toBe(expectedStatus)
            testBody(response.body);

        })
    }

    const deleteRequest = (path: string, expectedStatus: number, body: any, testBody: (body: any) => void): void => {
        request(baseUrl).delete(path).then((response: Response) => {
            expect(response.status).toBe(expectedStatus)
            testBody(response.body);

        })
    }


    test("smoke test", (done) => {
        getRequest("/check", 200, (body) => {
            expect(body.message).toMatch("hello")
            done()
        })
    })

    test("POST register guest", (done) => {
        postRequest("/guest/register", 201, {
            id: activeSession,
            username: "myusername",
            password: "12345678",
            firstName: "john",
            lastName: "dou",
            email: "johndou@john.com",
            country: "IL"
        }, (body) => {
            expect(body.ok).toBe(true)
            expect(body.data).toBe(undefined)
            expect(body.message).toMatch("success")
            done()
        })
        //act
    })


})