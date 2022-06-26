import {bundle} from "./Server/expressApp";
import {Server} from "./Server/Server";
import dotenv from "dotenv"

dotenv.config({path:`${__dirname}/../.env.${process.env.NODE_ENV}`})
const theServer = new Server(bundle);
theServer.start()