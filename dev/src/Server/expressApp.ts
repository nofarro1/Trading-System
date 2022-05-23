import express from "express";
import session from 'express-session';
import {Service} from "../service/Service";
import {systemContainer} from "../helpers/inversify.config";
import {TYPES} from "../helpers/types";


const service = systemContainer.get<Service>(TYPES.Service)
export const router = express.Router();


router.get('/check', (req, res) => {
    let sessId = req.session.id;
    console.log(sessId + " have been activated");
    res.status(200);
    res.send("hello, your id is " + sessId);

})

//access marketpalce - return the index.html
router.get('/', async (req, res) => {
    let sessId = req.session.id;
    try {
        console.log("guest " + sessId + " accessed marketplace");
        let guest = await service.accessMarketplace(sessId);

        req.socket.on("disconnect", async () => {
            await service.exitMarketplace(sessId)
        })

        res.status(200);
        res.send(guest)

    } catch (e:any) {
        res.status(403)
        res.send("could not access marketplace")
    }
   console.log("hello, your id is " + sessId);

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
        res.send(ans)
    } catch (e:any) {
        res.send(e.message)
    }

})

/**
 *
 * register an admin in the system.
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
        res.send(ans)
    } catch (e:any) {
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
        res.send(ans)
    } catch (e:any) {
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
router.post('/member/shopManagement/assignOwner', (req, res) => {

    try {
        let sessId = req.session.id
        let owner = req.body.owner.assigningOwnerId
        let shopId = req.body.shopId
        let newOwner = req.body.shopId
        let title = req.body.title
        let ans = service.appointShopOwner(sessId, newOwner, shopId, owner, title)
        res.send(ans)
    } catch (e:any) {
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
router.post('/member/shopManagement/assignManager', (req, res) => {

    try {
        let sessId = req.session.id
        let owner = req.body.owner.assigner
        let shopId = req.body.shopId
        let newManager = req.body.shopId
        let title = req.body.title
        let ans = service.appointShopManager(sessId, newManager, shopId, owner, title)
        res.send(ans)
    } catch (e:any) {
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
router.post('/member/shopManagement/Permissions', (req, res) => {


    try {
        let sessId = req.session.id
        let owner = req.body.owner.assigner
        let shopId = req.body.shopId
        let permissions = req.body.permissions
        let managerId = req.body.manager
        let ans = service.addPermissions(sessId, owner, managerId, shopId, permissions)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * remove manager permissions
 */
router.delete('/member/shopManagement/Permissions', (req, res) => {

    try {
        let sessId = req.session.id
        let owner = req.body.owner.assigner
        let shopId = req.body.shopId
        let permissions = req.body.permissions
        let managerId = req.body.manager

        let ans = service.removePermissions(sessId, owner, managerId, shopId, permissions)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})


/**
 * get shop personnel info
 */
router.get('api/member/shopManagement/Personnel/:username/:shop', (req, res) => {
    let sessId = req.session.id

    try {
        let username = req.params.username
        let shop: number = Number(req.params.shop);

        let ans = service.requestShopPersonnelInfo(sessId, username, shop)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})


/**
 * access marketplace
 */
router.get('/guest', (req, res) => {
    let sessId = req.session.id
    try {
        let ans = service.accessMarketplace(sessId)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})


//todo: on disconnect of session exit market place
/**
 * exit marketplace
 */
router.get('/exit', (req, res) => {
    let sessId = req.session.id
    try {
        let ans = service.exitMarketplace(sessId)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})

/*
query params - searchTerm, searchType, filters (i.e. price range, rating, ...)
 */
router.post('/product', (req, res) => {

    try {
        let sessId = req.session.id
        let searchTerm = req.body.term;
        let searchType = req.body.type;
        let filter = req.body.filter;
        let ans = service.searchProducts(sessId, searchType, searchTerm, filter);
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }

})

// add product to shop
router.post('/product/:shopId', (req, res) => {

    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let shopId = Number(req.params.shopId);
        let category = req.body.category;
        let name = req.body.name;
        let price = req.body.price;
        let quantity = req.body.quantity;
        let description = req.body.description
        let ans = service.addProductToShop(sessId, username, shopId, category, name, price, quantity, description)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }


})
router.delete('/product/:shopId/:productId', (req, res) => {


    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let shopId = Number(req.params.shopId)
        let productId = Number(req.params.productId)
        let ans = service.removeProductFromShop(sessId, username, shopId, productId)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})
router.patch('/product/:shopId/:productId', (req, res) => {


    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let shopId = Number(req.params.shopId)
        let productId = Number(req.params.productId)
        let quantity = Number(req.body.quantity)
        let ans = service.modifyProductQuantityInShop(sessId, username, shopId, productId, quantity)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})

//setup shop
router.post('api/shop/', (req, res) => {


    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let shopName = req.body.shopName;
        let ans = service.setUpShop(sessId, username, shopName)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})

router.get('api/shop/:shopId', (req, res) => {

    try {
        let sessId = req.session.id;
        let shopId = Number(req.params.shopId);

        let ans = service.getShopInfo(sessId, shopId)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})

router.patch('/shop/close/:shopId/:founder', (req, res) => {


    try {
        let sessId = req.session.id;
        let shopId = Number(req.params.shopId);
        let founder = req.params.founder;
        let ans = service.closeShop(sessId, founder, shopId)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})


router.get('/shop/orders/:shopId/:ownerUsername/:from/:to', (req, res) => {
    try {
        let sessId = req.session.id;
        let shopId = Number(req.params.shopId);
        let founder = req.params.ownerUsername;
        let from = new Date(req.params.from);
        let to = new Date(req.params.to);
        let filters = req.query.filter


        let ans = service.getShopPurchaseHistory(sessId, founder, shopId, from, to, filters)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})


router.get('/cart', (req, res) => {
    let sess = req.session.id
    try{
        let ans = service.checkShoppingCart(sess)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }

})


//addToCart
router.post('/cart/:productId/:quantity', (req, res) => {
    let sess = req.session.id
    try{
        let product = req.body.product
        let quantity = req.body.quantity
        let ans = service.addToCart(sess,product, quantity)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }

})

//modifyCart
router.patch('/cart/:productId/:quantity', (req, res) => {
    let sess = req.session.id
    try{
        let product = req.body.product
        let quantity = req.body.quantity
        let ans = service.editProductInCart(sess,product, quantity)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * checkout
 * body: {
 *     paymentDetails,
 *     deliveryDetails
 * }
 **/
router.post('/cart/checkout', (req, res) => {
    let sess = req.session.id
    try{
        let payment = req.body.paymentDetails
        let delivery = req.body.deliveryDetails
        let ans = service.checkout(sess,payment, delivery)
        res.send(ans)
    } catch (e:any) {
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
router.post('/admin/services/swap', (req, res) => {
    let sess = req.session.id
    try{
        let admin_name = req.body.admin
        let type = req.body.serviceType
        let serviceName = req.body.name
        let ans = service.swapConnectionWithExternalService(sess,admin_name,type,serviceName)
        res.send(ans)
    } catch (e:any) {
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
router.post('/admin/services/edit', (req, res) => {
    let sess = req.session.id
    try{
        let admin_name = req.body.admin
        let type = req.body.serviceType
        let settings = req.body.settings
        let ans = service.swapConnectionWithExternalService(sess,admin_name,type,settings)
        res.send(ans)
    } catch (e:any) {
        res.status(404)
        res.send(e.message)
    }
})


export const app = express();
export const sessionMiddleware = session({secret: "this is a secret", resave: false, saveUninitialized: true})
app.use(sessionMiddleware);
app.use(router);

