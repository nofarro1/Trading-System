import {app} from "../../src/Server/expressApp"
import {httpsServer, ioServer} from "../../src/Server/Server"
import request from "supertest"
import { Server } from "https";


let server: Server

beforeAll(() => {
    server = httpsServer;
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = String(0); //allow self-signed certificate
})
describe("networking tests", () => {

    test("smoke test", (done) => {
        request("https://localhost:3000").get('/').then((response) => {
            expect(response.status).toBe(200)
            let b = response.body
            expect(response.body.data._guestID).toBeDefined()
            done()
        })
    })
})