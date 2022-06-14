import {DataSource} from "typeorm";
import {logger} from "../helpers/logger";
import {Product} from "../domain/marketplace/Product";
import {Member} from "../domain/user/Member";
import {Message} from "../domain/notifications/Message";
import {Shop} from "../domain/marketplace/Shop";
import {Role} from "../domain/user/Role";
import {Products_In_Bag, ShoppingBag} from "../domain/user/ShoppingBag";
import {ShoppingCart} from "../domain/user/ShoppingCart";
import {MemberCredentials} from "../domain/SecurityController";
import {Offer} from "../domain/user/Offer";

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false},
    host: "ec2-3-248-121-12.eu-west-1.compute.amazonaws.com",
    port: 5432,
    username: "ufhkkaakrelkts",
    password: "7ea96cf4661dbe63cf41fc52fbfc5648f058ed15e5cec04e6477f1bd7aed0ddb",
    database: "dcd1o3u79ovm2u",
    synchronize: true,
    entities: [Product, Shop, Message, Member, Role, ShoppingBag, ShoppingCart, MemberCredentials, Offer, Products_In_Bag]
});

AppDataSource.initialize()
    .then(() => {
        logger.info("Data Source has been initialized!");
    })
    .catch((err) => {
        logger.error("Error during Data Source initialization", err);
    })