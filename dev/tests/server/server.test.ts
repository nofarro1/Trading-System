import {app} from "../../src/Server/expressApp"
import {Server} from "../../src/Server/Server"
import request, {Response} from "supertest"
import {systemContainer} from "../../src/helpers/inversify.config";
import {TYPES} from "../../src/helpers/types";

let server: Server
const baseUrl = "https://localhost:3000"
beforeAll(() => {
    server = new Server(app, systemContainer.get(TYPES.Service));
    server.start()
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = String(0); //allow self-signed certificate
})

afterAll(() => {
    server.shutdown()
})

const getRequest = (path: string, expectedStatus: number, testBody: (body:any) => void): void => {
    request(baseUrl).get(path).then((response: Response) => {
        expect(response.status).toBe(expectedStatus)
        testBody(response.body);
    })
}

const postRequest = (path: string, expectedStatus: number, body: any, testBody: (response: Response) => void): void => {
    request(baseUrl).post(path).send(body).then((response: Response) => {
        expect(response.status).toBe(expectedStatus)
        testBody(response.body);

    })
}

const patchRequest = (path: string,expectedStatus:number, body: any, testBody: (response: Response) => void): void => {
    request(baseUrl).patch(path).send(body).then((response: Response) => {
        expect(response.status).toBe(expectedStatus)
        testBody(response.body);

    })
}

const deleteRequest = (path: string, expectedStatus: number, body: any, testBody: (response: Response) => void): void => {
    request(baseUrl).delete(path).then((response: Response) => {
        expect(response.status).toBe(expectedStatus)
        testBody(response.body);

    })
}


describe("networking tests", () => {

    test("smoke test", (done) => {
        getRequest("/check", 200, (body) => {
            expect(body.message).toMatch("hello")
            done()
        })
    })
})