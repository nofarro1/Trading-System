import {Container} from "inversify";
import {TYPES} from "./types";
import {SystemController} from "../domain/SystemController";
import {Service} from "../service/Service";
import {GuestService} from "../service/GuestService";
import {MarketplaceService} from "../service/MarketplaceService";
import {MemberService} from "../service/MemberService";
import {OrderService} from "../service/OrderService";
import {ShoppingCartService} from "../service/ShoppingCartService";
import {ShoppingCartController} from "../domain/user/ShoppingCartController";
import {MessageController} from "../domain/notifications/MessageController";
import {UserController} from "../domain/user/UserController";
import {MarketplaceController} from "../domain/marketplace/MarketplaceController";
import {PurchaseController} from "../domain/purchase/PurchaseController";
import {SecurityController} from "../domain/SecurityController";
import {PaymentServiceAdaptor} from "../domain/external_services/PaymentServiceAdaptor";
import {DeliveryServiceAdaptor} from "../domain/external_services/DeliveryServiceAdaptor";
import {NotificationService} from "../service/NotificationService";
import {IDeliveryService} from "../domain/external_services/IDeliveryService";
import {DeliveryService} from "../domain/external_services/DeliveryService";
import {IPaymentService} from "../domain/external_services/IPaymentService";
import {PaymentService} from "../domain/external_services/PaymentService";
import dotenv from "dotenv";

dotenv.config({path:`${__dirname}/../../.env.${process.env.NODE_ENV}`})
console.log("enviorment is: " + process.env.NODE_ENV)
const env = process.env.NODE_ENV;

function bind(fresh: Container) {
//services
    fresh.bind<Service>(TYPES.Service).to(Service)
    fresh.bind<GuestService>(TYPES.GuestService).to(GuestService)
    fresh.bind<MarketplaceService>(TYPES.MarketplaceService).to(MarketplaceService)
    fresh.bind<MemberService>(TYPES.MemberService).to(MemberService)
    fresh.bind<OrderService>(TYPES.OrderService).to(OrderService)
    fresh.bind<ShoppingCartService>(TYPES.ShoppingCartService).to(ShoppingCartService)
    fresh.bind<NotificationService>(TYPES.NotificationService).to(NotificationService)
//controllers
    fresh.bind<SystemController>(TYPES.SystemController).to(SystemController).inSingletonScope()
    fresh.bind<ShoppingCartController>(TYPES.ShoppingCartController).to(ShoppingCartController)
    fresh.bind<MessageController>(TYPES.MessageController).to(MessageController)
    fresh.bind<UserController>(TYPES.UserController).to(UserController)
    fresh.bind<MarketplaceController>(TYPES.MarketplaceController).to(MarketplaceController).inSingletonScope()
    fresh.bind<PurchaseController>(TYPES.PurchaseController).to(PurchaseController)
    fresh.bind<SecurityController>(TYPES.SecurityController).to(SecurityController)
    const adminName:string = process.env.ADMIN_USERNAME;
    const adminPass:string = process.env.ADMIN_PASSWORD;
    fresh.bind<string>("adminUsername").toDynamicValue(() => adminName !== undefined ? adminName : "NO USERNAME PASSED");
    fresh.bind<string>("adminPassword").toDynamicValue(() => adminPass !== undefined ? adminPass : "NO PASSWORD PASSED");
//external services
    fresh.bind<string>("payment").toDynamicValue(() => env === "dev" ? "stub payment service" : " real payment")
    fresh.bind<string>("delivery").toDynamicValue(() => env === "dev" ? "stub delivery service" : " real delivery")
    fresh.bind<string>("RealPayment").toConstantValue("real payment")
    fresh.bind<string>("RealDelivery").toConstantValue("real delivery")
    fresh.bind<PaymentServiceAdaptor>(TYPES.PaymentServiceAdaptor).to(PaymentServiceAdaptor)
    fresh.bind<DeliveryServiceAdaptor>(TYPES.DeliveryServiceAdaptor).to(DeliveryServiceAdaptor)

    if (env === "prod") {
        fresh.bind<IDeliveryService>(TYPES.DeliveryService).to(DeliveryService);
        fresh.bind<IPaymentService>(TYPES.PaymentService).to(PaymentService);
    }
}

const createContainer = () => {
    const fresh = new Container();
    bind(fresh);
    fresh.snapshot()
    return fresh;
};

export const systemContainer = createContainer();

export const resetContainer = () => {
    systemContainer.unbindAll();
    systemContainer.restore()
    systemContainer.snapshot();
}

export const clearContainer = () => {
    systemContainer.unbindAll();
    bind(systemContainer)
}

const rebind = () => {
    clearContainer();

}


