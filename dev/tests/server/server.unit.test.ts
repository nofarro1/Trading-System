import {app, bundle} from "../../src/Server/expressApp"
import {Server} from "../../src/Server/Server"
import request, {Response} from "supertest"
import {systemContainer} from "../../src/helpers/inversify.config";
import {TYPES} from "../../src/helpers/types";
import {ProductCategory, ProductRate, SearchType, ShopStatus} from "../../src/utilities/Enums";
import {clearMocks, mockDependencies, mockInstance, mockMethod} from "../mockHelper";
import {Service} from "../../src/service/Service";
import {Result} from "../../src/utilities/Result";
import {SimpleMember} from "../../src/utilities/simple_objects/user/SimpleMember";
import {SimpleGuest} from "../../src/utilities/simple_objects/user/SimpleGuest";
import {SimpleProduct} from "../../src/utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleShop} from "../../src/utilities/simple_objects/marketplace/SimpleShop";
import {SimpleShoppingCart} from "../../src/utilities/simple_objects/user/SimpleShoppingCart";


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

describe("networking tests - basic actions", () => {
    mockInstance(mockDependencies.Service);
    let activeSession: string;
    let shopId: number;
    let productId: number;


    beforeAll((done) => {
        server = new Server(bundle);
        server.start()
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = "0"; //allow self-signed certificate
        agent = request.agent(app)
        // done()
        //access the marketplace before each test
        agent.get("/api/access").send().then((res) => {
            activeSession = res.body.data._guestID;
            console.log("requested new session")
            done();
        })

    })

    afterEach(() => {
        if (serviceMockMethod)
            clearMocks(serviceMockMethod)
    })

    afterAll((done) => {
        server.shutdown()
        done()
    })


    const getRequest = (path: string, expectedStatus: number, testBody: (body: any) => void): void => {
        const res = agent.get( "/api"+path);
        res.then((response: Response) => {
            expect(response.status).toBe(expectedStatus)
            testBody(response.body);
        })
    }

    const postRequest = (path: string, expectedStatus: number, body: any, testBody: (body: any) => void): void => {
        const res = agent.post("/api"+path).set("accept", "application/json")
        res.send(body).then((response: Response) => {
            expect(response.status).toBe(expectedStatus)
            testBody(response.body);
        })
    }

    const patchRequest = (path: string, expectedStatus: number, body: any, testBody: (body: any) => void): void => {
        agent.patch("/api"+path).set("accept", "application/json").send(body).then((response: Response) => {
            expect(response.status).toBe(expectedStatus)
            testBody(response.body);

        })
    }

    const deleteRequest = (path: string, expectedStatus: number, body: any, testBody: (body: any) => void): void => {
        agent.delete("/api"+path).then((response: Response) => {
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
        serviceMockMethod = mockMethod(Service.prototype, 'register', async (): Promise<Result<void>> => {
            return new Result(true, undefined, "success")
        })

        postRequest("/guest/register", 201, {
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
        serviceMockMethod = mockServiceMethod('login', new SimpleMember("myusername"))
        postRequest("/guest/login", 200, {
            username: "myusername",
            password: "12345678"
        }, (body) => {
            expect(body.ok).toBe(true)
            expect(body.data._username).toBe("myusername")
            done()
        })
    })

    test("GET - logout", (done) => {
        serviceMockMethod = mockServiceMethod('logout', new SimpleGuest(activeSession));
        getRequest(`/member/logout/myusername`, 200, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data._guestID).toBe(activeSession)
            done()
        })
    })

    test("GET - exit marketplace", (done) => {
        serviceMockMethod = mockServiceMethod<void>('exitMarketplace', undefined);
        getRequest(`/exit`, 202, (body) => {
            expect(body.ok).toBe(true)
            expect(body.data).toBe(undefined)
            done()
        })
    })

    test("POST - search products", (done) => {
        serviceMockMethod = mockServiceMethod<SimpleProduct[]>('searchProducts', [])
        postRequest("/product/search", 202, {
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
        serviceMockMethod = mockServiceMethod('setUpShop', new SimpleShop(0, "super shop", "founder",ShopStatus.open, []))
        postRequest("/shop", 201, {
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

        serviceMockMethod = mockServiceMethod('addProductToShop',
            new SimpleProduct(1, "cotage", shopId, 5.5, ProductCategory.A, ProductRate.NotRated, "this is a product description"))

        postRequest(`/product/${shopId}`, 201, {
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

        serviceMockMethod = mockServiceMethod<void>('modifyProductQuantityInShop', undefined)
        patchRequest(`/product/${shopId}/${productId}`, 200, {
            username: "myusername",
            quantity: 5
        }, (body) => {
            expect(body.ok).toBe(true);
            done()
        })
    })

    test("delete - product from shop", (done) => {
        serviceMockMethod = mockServiceMethod<void>('removeProductFromShop', undefined)

        deleteRequest(`/product/${shopId}/${productId}`, 200, {
            username: "myusername"
        }, (body) => {
            expect(body.ok).toBe(true);
            done()
        })
    })

    test("GET - get shop", (done) => {
        serviceMockMethod = mockServiceMethod('getShopInfo', new SimpleShop(0, "super shop","founder", ShopStatus.open, []))

        getRequest(`/shop/${shopId}`, 200, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data._ID).toBe(shopId);
            expect(body.data._name).toBe("super shop");
            expect(body.data._status).toBe(ShopStatus.open);
            done()
        })
    })

    test("PATCH - close shop", (done) => {
        serviceMockMethod = mockServiceMethod('closeShop', undefined)

        patchRequest(`/shop/close/${shopId}`, 200, {
            founder: "myusername"
        }, (body) => {
            expect(body.ok).toBe(true);
            done()
        })
    })

    test("GET - shopping cart", (done) => {
        serviceMockMethod = mockServiceMethod('checkShoppingCart', new SimpleShoppingCart("myusername", [], 0))
        getRequest(`/cart`, 200, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data._userId).toBe("myusername");
            expect(body.data._products).toBeDefined()
            done()
        })
    })

    test("POST - add to shopping cart", (done) => {

        serviceMockMethod = mockServiceMethod('addToCart', undefined)
        postRequest("/cart", 202, {
            product: productId,
            quantity: 2
        }, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data).toBe(undefined);
            done()
        })
    })

    test("Delete - remove product - shopping cart", (done) => {

        serviceMockMethod = mockServiceMethod<void>('removeFromCart', undefined)
        deleteRequest("/cart", 202, {
            product: productId,
        }, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data).toBe(undefined);
            done()
        })
    })


    test("PATCH - modify shopping cart product quantity", (done) => {
        serviceMockMethod = mockServiceMethod<void>('editProductInCart', undefined)
        patchRequest(`/cart`, 200, {
            product: productId,
            quantity: 3
        }, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data).toBe(undefined);
            done()
        })
    })

    test("POST - checkout", (done) => {
        serviceMockMethod = mockServiceMethod<void>('checkout', undefined)
        postRequest("/cart/checkout", 200, {
            paymentDetails: {
                creditNumber: "0000111122223333",
                expires: "12/30"
            },
            deliveryDetails: {
                city: "a city",
                street: "a street",
                houseNumber: "42"
            }
        }, (body) => {
            expect(body.ok).toBe(true);
            expect(body.data).toBe(undefined);
            done()
        })
    })

})


describe("networking test - complex scenarios", () => {
})