import {bundle} from "./Server/expressApp";
import {Server} from "./Server/Server";
const theServer = new Server(bundle);
theServer.start()