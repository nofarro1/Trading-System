import {app} from "../../src/Server/expressApp"
import {Server} from "../../src/Server/Server"
import request, {Response} from "supertest"
import {systemContainer} from "../../src/helpers/inversify.config";
import {TYPES} from "../../src/helpers/types";
import {ProductCategory, SearchType, ShopStatus} from "../../src/utilities/Enums";


jest.setTimeout(5000)
let server: Server
const baseUrl = "https://localhost:3000"


describe("networking tests - basic actions", () => {
    let activeSession: string;
    let shopId: number;
    let productId: number;

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
    })

    test("POST login guest", (done) => {
        postRequest("/guest/login", 200, {
            id: activeSession,
            username: "myusername",
            password: "12345678"
        }, (body) => {
            expect(body.ok).toBe(true)
            expect(body.data.username).toBe("myusername")
            expect(body.message).toMatch("success")
            done()
        })
    })

    test("GET - logout", (done) => {
        getRequest(`/members/logout/${activeSession}/myusername`, 200, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data._guestID).toBe(activeSession)
            done()
        })
    })

    test("GET - exit marketplace", (done) => {
        getRequest(`/exit/${activeSession}`, 202, (body) => {
            expect(body.ok).toBe(true)
            expect(body.data).toBe(undefined)
            expect(body.message).toMatch("bye")
            done()
        })
    })

    test("POST - search products", (done) => {
        postRequest("/products", 202, {
            id: activeSession,
            term: "cotage",
            type: SearchType.productName,
            filter: undefined
        }, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data).toBeInstanceOf(Array);
            done()
        })
    })

    test("POST - setup shop", (done) => {
        postRequest("/shop", 201, {
            id: activeSession,
            username: "myusername",
            shopName: "super shop",
        }, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data._ID).toBe(0);
            shopId = body.data._ID;
            expect(body.data._name).toBe("super shop");
            expect(body.data._status).toBe(ShopStatus.open);
            expect(body.data._products).toBeDefined();
            done()
        })
    })

    test("POST - add product to shop", (done) => {
        postRequest(`/product/${shopId}`, 201, {
            id: activeSession,
            username: "myusername",
            category: ProductCategory.A,
            name: "cotage",
            price: 5.5,
            quantity: 10,
            description: "this is a product description"
        }, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data._shopID).toBe(shopId);
            expect(body.data._productName).toBe("cotage");
            expect(body.data._price).toBe(5.5);
            done()
        })


    })

    test("PATCH - update product quantity", (done) => {
        patchRequest(`/product/${shopId}/${productId}`, 200, {
            id: activeSession,
            username: "myusername",
            quantity: 5
        }, (body) => {
            expect(body.ok).toBe(true);
            done()
        })
    })

    test("DELETE - delete product from shop", (done) => {
        deleteRequest(`/product/${shopId}/${productId}`, 200, {
            id: activeSession,
            username: "myusername"
        }, (body) => {
            expect(body.ok).toBe(true);
            done()
        })
    })

    test("GET - get shop", (done) => {
        getRequest(`/shop/${activeSession}/${shopId}`, 200, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data._ID).toBe(shopId);
            expect(body.data._name).toBe("super shop");
            expect(body.data._status).toBe(ShopStatus.open);
            done()
        })
    })

    test("PATCH - close shop", (done) => {
        patchRequest(`/shop/close/${shopId}`, 200, {
            id: activeSession,
            founder: "myusername"
        }, (body) => {
            expect(body.ok).toBe(true);
            done()
        })
    })

    test("GET - shopping cart", (done) => {
        getRequest(`cart/${activeSession}`, 200, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data._userId).toBe("myusername");
            expect(body.data.products).toBeInstanceOf(Map);
            done()
        })
    })

    test("POST - add to shopping cart", (done) => {
        postRequest("/cart",202,{
            id:activeSession,
            product: productId,
            quantity: 2
        }, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data).toBe(undefined);
            done()
        })
    })


    test("PATCH - modify shopping cart product quantity", (done) => {
        patchRequest(`/cart`, 200, {
            id:activeSession,
            product: productId,
            quantity: 3
        }, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data).toBe(undefined);
            done()
        })
    })

    test("POST - checkout", (done) => {
        postRequest("/cartcheckout",200,{
            id:activeSession,
            paymentDetails:{
                creditNumber: "0000111122223333",
                expires: "12/30"
            },
            deliveryDetails: {
                city:"a city",
                street: "a street",
                houseNumber: "42"
            }
        },(body)=>{
            expect(body.ok).toBe(true);
            expect(body.data).toBe(undefined);
            done()
        })
    })

})


describe("networking test - complex scenarios", () => {
})