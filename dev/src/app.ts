import {app} from "./Server/expressApp";
import {systemContainer} from "./helpers/inversify.config";
import {TYPES} from "./helpers/types";
import {Server} from "./Server/Server";
import 'reflect-metadata';

const theServer = new Server(app,systemContainer.get(TYPES.Service),systemContainer.get(TYPES.NotificationService));
theServer.start()