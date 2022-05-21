import {app} from './expressApp'
import https from 'https'
import fs from 'fs'
import {Server} from 'socket.io'

const keyPath = "./security/key.pam"
const certPath = "./security/cert.pam"
const port = process.env.PORT || 3000;

const httpsServer = https.createServer({
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
}, app)
const io: Server = new Server(httpsServer, {});


io.on('connection', (socket)=>{
    socket.id
})

httpsServer.listen(port, () => {
    console.log(`listening to localhost:${port}`);
})


