import {bundle} from "./Server/expressApp";
import {Server} from "./Server/Server";
import dotenv from "dotenv"

dotenv.config({path:`${__dirname}/../.env.${process.env.NODE_ENV}`})
console.log(process.env.NODE_ENV)
console.log(process.env.PORT)
const theServer = new Server(bundle);
theServer.start()