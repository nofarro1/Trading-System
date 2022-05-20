import express from "express";
import bodyParser from "body-parser";
import session from 'express-session'

const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(session({secret: "this is a secret", resave: true, saveUninitialized: true}));


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
app.post('/api/guest/register', (req, res) => {

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

app.post('/api/admin/register', (req, res) => {

})

/**
 *
 * login a member.
 * body suppose to be :
 * {
 *     username: string,
 *     password: string,
 *     firstName?: string,
 *     lastName?: string,
 *     email?: string,
 *     country?: string
 * }
 */
app.post('/api/guest/login', (req, res) => {

})


app.get('/api/member/logout/:username', (req, res) => {

})

/**
 * {sessionID: string,
 * newOwnerID: string,
 * shopID: number,
 * assigningOwnerID: string,
 * title?: string}
 */
app.post('/api/member/shopManagement/assignOwner', (req, res) => {

})


/**
 * {sessionID: string,
 * newManagerID: string,
 * shopID: number,
 * assigningOwnerID: string,
 * title?: string}
 */
app.post('/api/member/shopManagement/assignManager', (req, res) => {

})


app.post('/api/member/shopManagement/Permissions', (req, res) => {

})

app.delete('/api/member/shopManagement/Permissions', (req, res) => {

})

app.get('api/member/shopManagement/employees', (req, res) => {})



app.get('/api/guest', (req, res) => {})


//todo: on disconnect of session exit market place


/*
query params - searchTerm, searchType, filters (i.e. price range, rating, ...)
 */
app.get('api/product', (req, res) =>{

})
app.post('/api/product/:shopId',(req,res)=>{

})
app.delete('/api/product/:shopId/:productId',(req,res)=>{

})
app.patch('/api/product/:shopId/:productId',(req,res)=>{

})


app.post('api/shop/', (req, res) => {

})

app.get('api/shop/:shopId', (req, res) =>{

})

app.patch('/api/shop/close/:shopId',()=>{

})


app.get('/api/shop/orders/:shopId/:ownerUsername', (req, res) =>{

})


app.get('/api/cart', (req, res) =>{})


app.post('/api/cart/:productId/:quantity',(req,res)=>{})

app.patch('/api/cart/:productId/:quantity',(req,res)=>{})

/**
 * body: {
 *     paymentDetails,
 *     deliveryDetails
 * }
 **/
app.post('/api/cart/checkout',(req,res)=>{})


/**
 * body:
 * adminUsername,
 * serviceType,
 * serviceName,
 * settings
 */
app.post('/api/admin/services/swap',(req, res)=>{})

/**
 * body:
 * adminUsername,
 * serviceType,
 * settings
 */
app.post('/api/admin/services/edit',(req, res)=>{})
app.listen(port, () => {
    console.log(`listening to localhost:${port}`);
})