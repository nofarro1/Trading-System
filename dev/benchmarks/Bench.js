const autocannon = require("autocannon");
const membersData = require("./members.json");
const productsData = require("./products.json");
require("dotenv").config();
let members=[];
let products=[];
let memberCounter=0;
membersData.forEach((memberData) => members.push(memberData));
productsData.forEach((productData) => products.push(productData));

function accessReq() {
    return {
        method: 'GET',
        path: '/api/access',
        onResponse: (status, body, context) => {
            if (status === 200)
                context.session = JSON.parse(body).data._guestID;
            else context.session = "not session passed"
        }
    }
}
function loginReq(){
    let username=members[memberCounter].username;
    let password=members[memberCounter].password;
    memberCounter++;
    return{
        method: 'POST',
        path: "/api/guest/login",
        setupRequest: (req, context) => {
            req.body = JSON.stringify({session: context.session, username: username, password: password})
            return req;
        }
    }
}

function startBench() {
    const url = "https://localhost:" + 3000;
    const args = process.argv.slice(2);
    const numConnections = args[0] || 100;
    const maxConnectionRequests = args[1] || 2;
    const instance = autocannon({
        url: url,
        connections: 100,
        duration: 100,
        maxConnectionRequests: 4,
        headers: {
            "Content-Type": "application/json",
            "Connection": "keep-alive"

        },
        requests: [
            accessReq(),
            loginReq()
        ]
    }, finishedBenchmark);

    autocannon.track(instance);

    function finishedBenchmark(err, res) {
        console.log("Finished Bench", err, res);
    }
}

startBench();