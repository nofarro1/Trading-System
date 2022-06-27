import express, {Express} from "express";
import session from 'express-session';
import {Service} from "../service/Service";
import {systemContainer} from "../helpers/inversify.config";
import {TYPES} from "../helpers/types";
import {Result} from "../utilities/Result";
import cors from "cors"
import {PaymentService} from "../domain/external_services/PaymentService";
import {AppRoutingModule} from "../Client/client/src/app/app-routing.module";
import {NotificationService} from "../service/NotificationService";
import {StateInitializer} from "./StateInitializer";
import config from "../config";
import { logger } from "../helpers/logger";


const service = systemContainer.get<Service>(TYPES.Service)
export const router = express.Router();


//set routes to api

router.get('/check', (req, res) => {
    let sessId = req.session.id;
    console.log(sessId + " have been activated");
    res.status(200).send({message: "hello, your id is " + sessId});

})


//set routes to api

//access marketpalce - return the index.html in the future
router.get('/access', async (req, res) => {
    let sessId = req.session.id;
    logger.warn("[in access - expressApp]");
    try {
        console.log("guest " + sessId + " try to access marketplace");
        let guest = await service.accessMarketplace(sessId);


        req.socket.on("disconnect", async () => {
            console.log(`client ${sessId} disconnected`);
            await service.exitMarketplace(sessId)
        })

        res.status(200);
        res.send(guest)

    } catch (e: any) {
        res.status(401)
        res.send("could not access marketplace")
    }
})

/**
 *
 * register a guest in the system.
 * body:
 * {
 *     username: string,
 *     password: string,
 *     firstName?: string,
 *     lastName?: string,
 *     email?: string,
 *     country?: string
 * }
 */
router.post('/guest/register', async (req, res) => {
    try {
        let sessId = req.body.session;
        let username = req.body.username;
        let password = req.body.password;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let email = req.body.email;
        let country = req.body.country;
        logger.warn("[/guest/register] start with username: " + username);
        logger.info(`seesId = ${sessId}`);
        let ans = await service.register(sessId, username, password, firstName, lastName, email, country);
        logger.warn("[/guest/register] after service.register");
        console.log("end /guest/register - ans returned : ");
        console.log(ans);
        res.status(201);
        res.send(ans);
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }

})

/**
 *
 * register an admin in the system.
 * body:
 * {
 *     id: string
 *     username: string,
 *     password: string,
 *     firstName?: string,
 *     lastName?: string,
 *     email?: string,
 *     country?: string
 * }
 */

router.post('/admin/register', async (req, res) => {


    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let password = req.body.password;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let email = req.body.email;
        let country = req.body.country;
        let ans = await service.registerAdmin(sessId, username, password, firstName, lastName, email, country)
        res.status(201)
        res.send(ans)
    } catch (e: any) {
        res.status(401)
        res.send(e.message)
    }

})

/**
 *
 * login a member.
 * body suppose to be :
 * {
 *     id: string
 *     username: string,
 *     password: string,
 * }
 */
router.post('/guest/login', async (req, res) => {
    try {
        let sessId = req.body.session;
        console.log("attempt to login with session id: " + sessId)
        let username = req.body.username;
        let password = req.body.password;
        let ans = await service.login(sessId, username, password)
        res.send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * logout
 */
router.get('/member/logout/:username/:session', async (req, res) => {
    try {
        let sessId = req.params.session;
        let username = req.params.username
        logger.warn("in logout session");
        let ans = await service.logout(sessId, username)
        req.session.loggedIn = false;
        req.session.username = "";
        res.send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * appoint shop Owner
 * {
 * newOwnerID: string,
 * shopID: number,
 * assigningOwnerID: string,
 * title?: string}
 */
router.post('/member/shopManagement/assignOwner', async (req, res) => {

    try {
        let sessId = req.session.id
        let owner = req.body.owner
        let shopId = req.body.shopId
        let newOwner = req.body.newOwnerId
        let ans = await service.appointShopOwner(sessId, newOwner, shopId, owner)
        res.send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * request to appoint shop Owner
 * {
 * newOwnerID: string,
 * shopID: number,
 * assigningOwnerID: string,
 * title?: string}
 */
router.post('/member/shopManagement/requestAppOwner', async (req, res) => {

    try {
        let sessId = req.session.id
        let owner = req.body.owner
        let shopId = Number(req.body.shopId)
        let newOwner = req.body.newOwnerId
        let ans = await service.submitOwnerAppointmentInShop(sessId, shopId,newOwner, owner)
        res.send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})


/**
 * appoint shop manager
 * {
 * newManagerID: string,
 * shopID: number,
 * assigner: string,
 * title?: string
 * }
 */
router.post('/member/shopManagement/assignManager', async (req, res) => {

    try {
        let sessId = req.session.id
        let owner = req.body.owner
        let shopId = req.body.shopId
        let newManager = req.body.newManager
        let title = req.body.title
        let ans = await service.appointShopManager(sessId, newManager, shopId, owner, title)
        res.send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * add permissions
 * body {
 *      assigner: string,
 *      manager: string,
 *      shopId: number,
 *      permissions: Permissions
 * }
 */
router.post('/member/shopManagement/Permissions', async (req, res) => {


    try {
        let sessId = req.session.id
        let owner = req.body.owner
        let shopId = req.body.shopId
        let permissions = req.body.permissions
        let managerId = req.body.manager
        let ans = await service.addPermissions(sessId, owner, managerId, shopId, permissions)
        res.send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * remove manager permissions
 */
router.delete('/member/shopManagement/Permissions', async (req, res) => {

    try {
        let sessId = req.session.id
        let owner = req.body.owner
        let shopId = req.body.shopId
        let permissions = req.body.permissions
        let managerId = req.body.manager

        let ans = await service.removePermissions(sessId, owner, managerId, shopId, permissions)
        res.send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})


/**
 * get shop personnel info
 */
router.get('/member/shopManagement/Personnel/:username/:shop', async (req, res) => {


    try {
        let sessId = req.session.id
        let username = req.params.username
        let shop: number = Number(req.params.shop);

        let ans = await service.requestShopPersonnelInfo(sessId, username, shop)
        res.send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})


// /**
//  * access marketplace
//  */
// router.get('/guest', async (req, res) => {
//     let sessId = req.session.id
//     try {
//         let ans = await service.accessMarketplace(sessId)
//         res.send(ans)
//     } catch (e: any) {
//         res.status(404)
//         res.send(e.message)
//     }
// })


//todo: on disconnect of session exit marketplace
/**
 * exit marketplace
 */
router.get('/exit', async (req, res) => {

    try {
        let sessId = req.session.id
        let ans = await service.exitMarketplace(sessId)
        res.status(202).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

/*
Body - searchTerm, searchType, filters (i.e. price range, rating, ...)
 */
router.post('/product/search', async (req, res) => {
    try {
        let sessId = req.session.id
        let searchTerm = req.body.term;
        let searchType = req.body.type;
        let filter = req.body.filter;
        let ans = await service.searchProducts(sessId, searchType, searchTerm, filter);
        res.status(202).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * add product to shop
 */
router.post('/product/:shopId', async (req, res) => {

    try {
        let sessId = req.body.session;
        let shopId = Number(req.params.shopId);
        let category = req.body.category;
        let name = req.body.name;
        let price = req.body.price;
        let quantity = req.body.quantity;
        let description = req.body.description
        let ans = await service.addProductToShop(sessId, shopId, category, name, price, quantity, description)
        res.status(201).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

// /**
//  * add discount to shop
//  */
// router.post('/discount/:shopId', async (req, res) => {

//     try {
//         let sessId = req.body.session;
//         let shopId = req.params.shopId;
//         let info = req.body.info;
//         let discountPercent = req.body.discountPercent;
//         let description = req.body.description;
//         let ans = await service.addDiscountToShop(sessId, shopId, info, discountPercent, description);
//         res.status(201).send(ans)
//     } catch (e: any) {
//         res.status(404)
//         res.send(e.message)
//     }
// })

/**
 * delete product in shop
 */
router.delete('/product/:shopId/:productId', async (req, res) => {
    try {
        let sessId = req.body.session;
        let shopId = Number(req.params.shopId)
        let productId = Number(req.params.productId)
        let ans = await service.removeProductFromShop(sessId, shopId, productId)
        res.status(200).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})
/**
 * update product quantity
 */
router.patch('/product/:shopId/:productId', async (req, res) => {


    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let shopId = Number(req.params.shopId)
        let productId = Number(req.params.productId)
        let quantity = Number(req.body.quantity)
        let ans = await service.modifyProductQuantityInShop(sessId, username, shopId, productId, quantity)
        res.send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

//setup shop
router.post('/shop', async (req, res) => {
    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let shopName = req.body.shopName;
        let ans = await service.setUpShop(sessId, username, shopName)
        res.status(201).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})
/**
 * get shop
 */
router.get('/shop/:shopId', async (req, res) => {

    try {
        let sessId = req.session.id;
        let shopId = Number(req.params.shopId);
        let ans = await service.getShopInfo(sessId, shopId)
        res.status(200).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * get all shops
 */
router.get('/shops/:session', async (req, res) => {
    try {
        const sessID = req.params.session;
        console.log("in the function that return all shops");
        // let sessId = req.session.id;
        // let ans = await service.getAllShopsInfo(sessId)
        let ans = await service.getAllShopsInfo(sessID);
        console.log("after the return shops");
        console.log(ans);
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message)
    }
})

/**
 * close shop
 */
router.patch('/shop/close', async (req, res) => {
    try {
        let sessId = req.body.session;
        let shopId = Number(req.body.shopId);
        let founder = req.body.founder;
        let ans = await service.closeShop(sessId, founder, shopId)
        res.status(200).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

//purchase history
router.get('/shop/orders/:shopId/:ownerUsername/:from/:to', async (req, res) => {
    try {
        let sessId = req.session.id;
        let shopId = Number(req.params.shopId);
        let founder = req.params.ownerUsername;
        let from = new Date(req.params.from);
        let to = new Date(req.params.to);
        let filters = req.query.filter


        let ans = await service.getShopPurchaseHistory(sessId, founder, shopId, from, to, filters)
        res.send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})




//addToCart
router.post('/cart/add', async (req, res) => {
    try {
        let sess = req.body.session
        let product = req.body.product
        let shopID = req.body.shop;
        let quantity = req.body.quantity
        console.log(`[expressApp/addToCart] start w/ sess = ${sess} product = ${product} quantity = ${quantity}`);
        let ans = await service.addToCart(sess, shopID,product, quantity)
        res.status(202).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }

})

//removeFromCart
router.delete('/cart/remove', async (req, res) => {

    try {
        let sess = req.session.id
        let product = req.body.product
        let ans: Result<void> = await service.removeFromCart(sess, product.shopId, product)
        res.status(202).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }

})

//modifyCart
router.patch('/cart/modify', async (req, res) => {
    try {
        let sess = req.session.id
        let product = req.body.product
        let quantity = req.body.quantity
        let ans: Result<void> = await service.editProductInCart(sess, product, quantity)
        res.status(200).send(ans)
    } catch (e: any) {
        res.status(404).send(e.message)
    }
})

/**
 * checkout
 * body: {
 *     paymentDetails,
 *     deliveryDetails
 * }
 **/
router.post('/cart/checkout', async (req, res) => {

    try {
        let sess = req.session.id
        let payment = req.body.paymentDetails
        let delivery = req.body.deliveryDetails
        let ans = await service.checkout(sess, payment, delivery)
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }

})

router.get('/cart', async (req, res) => {

    try {
        let sess = req.session.id
        let ans = await service.checkShoppingCart(sess)
        res.status(200).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }

})

//------------------------ discounts -------------------------------//

router.post('/shop/discounts', async (req, res) => {
    try {
        const sessID = req.body.sessID;
        const shopID = Number(req.body.shopID);
        let ans = await service.getDiscounts(sessID,shopID);
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message)
    }
})

router.post('/shop/discount', async (req, res) => {
    try {
        const sessID = req.body.sessID;
        const shopID = Number(req.body.shopID);
        const discount = req.body.discount;
        let ans = await service.addDiscount(sessID,shopID,discount);
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message)
    }
})
router.delete('/shop/discount/:sessID/:shopID/:dId', async (req, res) => {
    try {
        const sessID = req.params.sessID;
        const shopID = Number(req.params.shopID);
        const dId = Number(req.params.dId);
        let ans = await service.removeDiscount(sessID,shopID,dId);
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message)
    }
})

//------------------------ policy -------------------------------//

router.get('/shop/policies', async (req, res) => {
    try {
        const sessID = req.body.sessID;
        const shopID = Number(req.body.shopID);
        let ans = await service.getPolicies(sessID,shopID);
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message)
    }
})

router.post('/shop/policy', async (req, res) => {
    try {
        const sessID = req.body.sessID;
        const shopID = Number(req.body.shopID);
        const policy = req.body.policy;
        let ans = await service.addPurchasePolicy(sessID,shopID,policy);
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message)
    }
})
router.delete('/shop/policy/:sessID/:shopID/:pId', async (req, res) => {
    try {
        const sessID = req.params.sessID;
        const shopID = Number(req.params.shopID);
        const pId = Number(req.params.pId);
        let ans = await service.removePurchasePolicy(sessID,shopID,pId);
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message)
    }
})
//------------------------ offers -------------------------------//

router.post('/shop/offer', async (req, res) => {
    try {
        const sessID = req.body.sessID;
        const shopID = Number(req.body.shopID);
        const pId = Number(req.body.pId);
        const price = Number(req.body.price);
        let ans = await service.addOffer2Shop(sessID,shopID,pId,price);
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message)
    }
})

router.post('/shop/counteroffer', async (req, res) => {
    try {
        const sessID = req.body.sessID;
        const shopID = Number(req.body.shopID);
        const offerID = Number(req.body.offerID);
        const counterPrice = Number(req.body.counterPrice);
        let ans = await service.filingCounterOffer(sessID,shopID,offerID,counterPrice);
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message)
    }
})

router.post('/shop/denycounteroffer', async (req, res) => {
    try {
        const sessID = req.body.sessID;
        const shopID = Number(req.body.shopID);
        const offerID = Number(req.body.offerID);
        const username = req.body.username;
        let ans = await service.denyCounterOffer(sessID,username,shopID,offerID);
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message)
    }
})

/**
 * swap service
 * body:
 * adminUsername,
 * serviceType,
 * serviceName,
 * settings
 */
router.post('/admin/services/swap', async (req, res) => {

    try {
        let sess = req.session.id
        let admin_name = req.body.admin
        let type = req.body.serviceType
        let serviceName = req.body.name
        let ans = await service.swapConnectionWithExternalService(sess, admin_name, type, serviceName)
        res.send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * edit service
 * body:
 * adminUsername,
 * serviceType,
 * settings
 */
router.post('/admin/services/edit', async (req, res) => {

    try {
        let sess = req.session.id
        let admin_name = req.body.admin
        let type = req.body.serviceType
        let settings = req.body.settings
        let ans = await service.swapConnectionWithExternalService(sess, admin_name, type, settings)
        res.send(ans)
    } catch (e: any) {
        res.status(402)
        res.send(e.message)
    }
})


/**
 * {
 *     adminname,
 *     password,
 *
 * }
 */
router.post('/admin/system/init', async (req, res) => {
    try {
        const sessID = req.session.id;
        const username = req.body.username;
        const password = req.body.password;
        const isLoggedIn = await service.checkAdminPermissions(sessID,username,password); // should be true. if not it supposes to go to catch
        const initStatus = await service.stateInit.initialize();
        res.status(200).send(Result.Ok(true,"successfully initiated the system"))
    } catch (e) {
        logger.error(e.message)
        res.status(500).send(Result.Fail(e.message))
    }
})

router.post('/admin/system/reset', async (req, res) => {
    try {
        const sessID = req.session.id;
        const username = req.body.username;
        const password = req.body.password;
        const isLoggedIn = await service.checkAdminPermissions(sessID,username,password); // should be true. if not it supposes to go to catch
        const resetStatus = await service.stateInit.reset();
        const initStatus = await service.stateInit.initialize();
        res.status(200).send(Result.Ok(true,"successfully initiated the system"))
    } catch (e) {
        logger.error(e.message)
        res.status(500).send(Result.Fail(e.message))
    }
})
router.post('/admin/setup/clean', async (req, res) => {
    try {
        const sessID = req.session.id;
        const username = req.body.username;
        const password = req.body.password;
        const isLoggedIn = await service.checkAdminPermissions(sessID,username,password); // should be true. if not it supposes to go to catch
        const initStatus = await service.stateInit.reset();
        res.status(200).send(Result.Ok(true,"successfully initiated the system"))
    } catch (e) {
        logger.error(e.message)
        res.status(500).send(Result.Fail(e.message))
    }
})

//------------------------ messages -------------------------------//

router.get('/messages/:memberId', async (req, res) => {
    try {
        let sess = req.session.id;
        let ans = await service.getMessages(sess)
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message);
    }
})

router.get('/messages/:memberId', async (req, res) => {
    try {
        let sess = req.session.id;
        let ans = await service.getMessages(sess)
        res.status(200).send(ans);
    } catch (e: any) {
        res.status(404).send(e.message);
    }
})

router.get('/', (req, res) => {
    req.session.loggedIn = false;
    req.session.username = "";
    res.sendFile(__dirname + '/index.html');
});

// configure the express app


const _app_folder = './src/Client/client/dist/client'
export const app = express();
export const sessionConfig = {
    secret: "this is a secret",
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false}
}
export const sessionMiddleware = session(sessionConfig)
app.use(cors())
app.use(sessionMiddleware);
app.use(express.json())

app.use('/', express.static(_app_folder))
app.use('/shops', express.static(_app_folder))
app.use('/shop/:id', express.static(_app_folder))
app.use('/cart', express.static(_app_folder))
app.use('/signup', express.static(_app_folder))
// app.all('/*', function (req, res) {
//     res.status(200).sendFile('/', {root: _app_folder})
// })
app.use('/api', router);
export const bundle: { app: Express, service: Service, notificationService: NotificationService } = {
    app: app,
    service: service,
    notificationService: systemContainer.get(TYPES.NotificationService)
}
