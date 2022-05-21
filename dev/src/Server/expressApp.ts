import express from "express";
import session from 'express-session';
import {SystemController} from "../domain/SystemController";
import {Service} from "../service/Service";

export const app = express();


const systemController = SystemController.initialize();
const service = new Service(systemController)

app.use(session({secret: "this is a secret", saveUninitialized: true}));

app.get('/', (req, res) => {
    let sessId = req.session.id;
    res.send("hello, your id is " + sessId);

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
app.post('/api/guest/register', async (req, res) => {


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
    } catch (e) {
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

app.post('/api/admin/register', async (req, res) => {


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
    } catch (e) {
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
app.post('/api/guest/login', async (req, res) => {


    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let password = req.body.password;
        let ans = await service.login(sessId, username, password)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * logout
 */
app.get('/api/member/logout/:username', async (req, res) => {


    try {
        let sessId = req.session.id;
        let username = req.params.username
        let ans = await service.logout(sessId, username)
        res.send(ans)
    } catch (e) {
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
app.post('/api/member/shopManagement/assignOwner', (req, res) => {

    try {
        let sessId = req.session.id
        let owner = req.body.owner.assigningOwnerId
        let shopId = req.body.shopId
        let newOwner = req.body.shopId
        let title = req.body.title
        let ans = service.appointShopOwner(sessId, newOwner, shopId, owner, title)
        res.send(ans)
    } catch (e) {
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
app.post('/api/member/shopManagement/assignManager', (req, res) => {

    try {
        let sessId = req.session.id
        let owner = req.body.owner.assigner
        let shopId = req.body.shopId
        let newManager = req.body.shopId
        let title = req.body.title
        let ans = service.appointShopManager(sessId, newManager, shopId, owner, title)
        res.send(ans)
    } catch (e) {
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
app.post('/api/member/shopManagement/Permissions', (req, res) => {


    try {
        let sessId = req.session.id
        let owner = req.body.owner.assigner
        let shopId = req.body.shopId
        let permissions = req.body.permissions
        let managerId = req.body.manager
        let ans = service.addPermissions(sessId, owner, managerId, shopId, permissions)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})

/**
 * remove manager permissions
 */
app.delete('/api/member/shopManagement/Permissions', (req, res) => {

    try {
        let sessId = req.session.id
        let owner = req.body.owner.assigner
        let shopId = req.body.shopId
        let permissions = req.body.permissions
        let managerId = req.body.manager

        let ans = service.removePermissions(sessId, owner, managerId, shopId, permissions)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})


/**
 * get shop personnel info
 */
app.get('api/member/shopManagement/Personnel/:username/:shop', (req, res) => {
    let sessId = req.session.id

    try {
        let username = req.params.username
        let shop: number = Number(req.params.shop);

        let ans = service.requestShopPersonnelInfo(sessId, username, shop)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})


/**
 * access marketplace
 */
app.get('/api/guest', (req, res) => {
    let sessId = req.session.id
    try {
        let ans = service.accessMarketplace(sessId)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})


//todo: on disconnect of session exit market place
/**
 * exit marketplace
 */
app.get('/api/exit', (req, res) => {
    let sessId = req.session.id
    try {
        let ans = service.exitMarketplace(sessId)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})

/*
query params - searchTerm, searchType, filters (i.e. price range, rating, ...)
 */
app.post('api/product/', (req, res) => {

    try {
        let sessId = req.session.id
        let searchTerm = req.body.term;
        let searchType = req.body.type;
        let filter = req.body.filter;
        let ans = service.searchProducts(sessId, searchType, searchTerm, filter);
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }

})

// add product to shop
app.post('/api/product/:shopId', (req, res) => {

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
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }


})
app.delete('/api/product/:shopId/:productId', (req, res) => {


    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let shopId = Number(req.params.shopId)
        let productId = Number(req.params.productId)
        let ans = service.removeProductFromShop(sessId, username, shopId, productId)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})
app.patch('/api/product/:shopId/:productId', (req, res) => {


    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let shopId = Number(req.params.shopId)
        let productId = Number(req.params.productId)
        let quantity = Number(req.body.quantity)
        let ans = service.modifyProductQuantityInShop(sessId, username, shopId, productId, quantity)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})

//setup shop
app.post('api/shop/', (req, res) => {


    try {
        let sessId = req.session.id;
        let username = req.body.username;
        let shopName = req.body.shopName;
        let ans = service.setUpShop(sessId, username, shopName)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})

app.get('api/shop/:shopId', (req, res) => {

    try {
        let sessId = req.session.id;
        let shopId = Number(req.params.shopId);

        let ans = service.getShopInfo(sessId, shopId)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})

app.patch('/api/shop/close/:shopId/:founder', (req, res) => {


    try {
        let sessId = req.session.id;
        let shopId = Number(req.params.shopId);
        let founder = req.params.founder;
        let ans = service.closeShop(sessId, founder, shopId)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})


app.get('/api/shop/orders/:shopId/:ownerUsername/:from/:to', (req, res) => {
    try {
        let sessId = req.session.id;
        let shopId = Number(req.params.shopId);
        let founder = req.params.ownerUsername;
        let from = new Date(req.params.from);
        let to = new Date(req.params.to);
        let filters = req.query.filter


        let ans = service.getShopPurchaseHistory(sessId, founder, shopId, from, to, filters)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})


app.get('/api/cart', (req, res) => {
    let sess = req.session.id
    try{
        let ans = service.checkShoppingCart(sess)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }

})


//addToCart
app.post('/api/cart/:productId/:quantity', (req, res) => {
    let sess = req.session.id
    try{
        let product = req.body.product
        let quantity = req.body.quantity
        let ans = service.addToCart(sess,product, quantity)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }

})

//modifyCart
app.patch('/api/cart/:productId/:quantity', (req, res) => {
    let sess = req.session.id
    try{
        let product = req.body.product
        let quantity = req.body.quantity
        let ans = service.editProductInCart(sess,product, quantity)
        res.send(ans)
    } catch (e) {
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
app.post('/api/cart/checkout', (req, res) => {
    let sess = req.session.id
    try{
        let payment = req.body.paymentDetails
        let delivery = req.body.deliveryDetails
        let ans = service.checkout(sess,payment, delivery)
        res.send(ans)
    } catch (e) {
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
app.post('/api/admin/services/swap', (req, res) => {
    let sess = req.session.id
    try{
        let admin_name = req.body.admin
        let type = req.body.serviceType
        let serviceName = req.body.name
        let ans = service.swapConnectionWithExternalService(sess,admin_name,type,serviceName)
        res.send(ans)
    } catch (e) {
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
app.post('/api/admin/services/edit', (req, res) => {
    let sess = req.session.id
    try{
        let admin_name = req.body.admin
        let type = req.body.serviceType
        let settings = req.body.settings
        let ans = service.swapConnectionWithExternalService(sess,admin_name,type,settings)
        res.send(ans)
    } catch (e) {
        res.status(404)
        res.send(e.message)
    }
})


