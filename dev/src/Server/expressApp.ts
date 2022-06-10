import express from "express";
import session from 'express-session';
import {Service} from "../service/Service";
import {systemContainer} from "../helpers/inversify.config";
import {TYPES} from "../helpers/types";
import {Result} from "../utilities/Result";


const service = systemContainer.get<Service>(TYPES.Service)
export const router = express.Router();


router.get('/check', (req, res) => {
    let sessId = req.session.id;
    console.log(sessId + " have been activated");
    res.status(200);
    res.send({message: "hello, your id is " + sessId});

})

router.get('/', (req, res) => {
    req.session.loggedIn = false;
    req.session.username = "";
    res.sendFile(__dirname + '/index.html');
});
//access marketpalce - return the index.html in the future
router.get('/access', async (req, res) => {
    let sessId = req.session.id;
    try {
        console.log("guest " + sessId + " accessed marketplace");
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
        let sessId = req.session.id;
        let username = req.body.username;
        let password = req.body.password;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let email = req.body.email;
        let country = req.body.country;
        let ans = await service.register(sessId, username, password, firstName, lastName, email, country)
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
        let sessId = req.session.id;
        let username = req.body.username;
        let password = req.body.password;
        let ans = await service.login(sessId, username, password)
        req.session.username = username;
        req.session.loggedIn = true;
        res.send(ans)
    } catch (e: any) {
        req.session.username = "";
        req.session.loggedIn = false;
        res.status(404)
        res.send(e.message)
    }
})

/**
 * logout
 */
router.get('/member/logout/:username', async (req, res) => {
    try {
        let sessId = req.session.id;
        let username = req.params.username
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
        let owner = req.body.owner.assigningOwnerId
        let shopId = req.body.shopId
        let newOwner = req.body.shopId
        let title = req.body.title
        let ans = await service.appointShopOwner(sessId, newOwner, shopId, owner, title)
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
        let owner = req.body.owner.assigner
        let shopId = req.body.shopId
        let newManager = req.body.shopId
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
        let owner = req.body.owner.assigner
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
        let owner = req.body.owner.assigner
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


//todo: on disconnect of session exit market place
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
        let sessId = req.session.id;
        let username = req.body.username;
        let shopId = Number(req.params.shopId);
        let category = req.body.category;
        let name = req.body.name;
        let price = req.body.price;
        let quantity = req.body.quantity;
        let description = req.body.description
        let ans = await service.addProductToShop(sessId, username, shopId, category, name, price, quantity, description)
        res.status(201).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }


})
/**
 * delete product in shop
 */
router.delete('/product/:shopId/:productId', async (req, res) => {


    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let shopId = Number(req.params.shopId)
        let productId = Number(req.params.productId)
        let ans = await service.removeProductFromShop(sessId, username, shopId, productId)
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
router.post('/shop/', async (req, res) => {
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
router.get('/shop/:id/:shopId', async (req, res) => {

    try {
        let sessId = req.params.id;
        let shopId = Number(req.params.shopId);

        let ans = await service.getShopInfo(sessId, shopId)
        res.status(200).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * close shop
 */
router.patch('/shop/close/:shopId', async (req, res) => {


    try {
        let sessId = req.session.id;
        let shopId = Number(req.params.shopId);
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


//addToCart
router.post('/cart', async (req, res) => {

    try {
        let sess = req.session.id
        let product = req.body.product
        let quantity = req.body.quantity
        let ans = await service.addToCart(sess, product, quantity)
        res.status(202).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }

})

//removeFromCart
router.delete('/cart', async (req, res) => {

    try {
        let sess = req.session.id
        let product = req.body.product
        let ans: Result<void> = await service.removeFromCart(sess, product)
        res.status(202).send(ans)
    } catch (e: any) {
        res.status(404)
        res.send(e.message)
    }

})

//modifyCart
router.patch('/cart/', async (req, res) => {
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


export const app = express();
export const sessionMiddleware = session({secret: "this is a secret", resave: false, saveUninitialized: true})
app.use(sessionMiddleware);
app.use(express.json())
app.use(router);

