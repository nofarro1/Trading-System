import {DiscountType, ProductCategory} from "./Enums";
import {LiveNotificationSubscriber} from "../service/NotificationService";
import {Session} from "express-session";
import "express-session";

export type Answer = {
    ok: boolean;
    message: string;
};

export type discountInf = {
    type: DiscountType;
    object: number | ProductCategory | undefined;
};




export type ServiceSettings = {
    min: number;
    max: number;
    url: string;

}

declare module "express-session" {
    interface Session {
        username: string;
        loggedIn: boolean;
        sessionSubscriber?:LiveNotificationSubscriber;
    }
}

declare module "http" {
    interface IncomingMessage {
        session: Session;
        username: string;
        loggedIn: boolean;
    }
}

