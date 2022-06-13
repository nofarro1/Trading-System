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
import {NotificationController} from "../domain/notifications/NotificationController";
import {MarketplaceController} from "../domain/marketplace/MarketplaceController";
import {PurchaseController} from "../domain/purchase/PurchaseController";
import {SecurityController} from "../domain/SecurityController";
import {PaymentServiceAdaptor} from "../domain/external_services/PaymentServiceAdaptor";
import {DeliveryServiceAdaptor} from "../domain/external_services/DeliveryServiceAdaptor";
import { NotificationService } from "../service/NotificationService";
import {IDeliveryService} from "../domain/external_services/IDeliveryService";
import {getEnvironmentData} from "worker_threads";
import {DeliveryService} from "../domain/external_services/DeliveryService";
import {IPaymentService} from "../domain/external_services/IPaymentService";
import {PaymentService} from "../domain/external_services/PaymentService";
import config from "../config";


const systemContainer = new Container();
//services
systemContainer.bind<Service>(TYPES.Service).to(Service).inSingletonScope()
systemContainer.bind<GuestService>(TYPES.GuestService).to(GuestService)
systemContainer.bind<MarketplaceService>(TYPES.MarketplaceService).to(MarketplaceService)
systemContainer.bind<MemberService>(TYPES.MemberService).to(MemberService)
systemContainer.bind<OrderService>(TYPES.OrderService).to(OrderService)
systemContainer.bind<ShoppingCartService>(TYPES.ShoppingCartService).to(ShoppingCartService)
systemContainer.bind<NotificationService>(TYPES.NotificationService).to(NotificationService)
//controllers
systemContainer.bind<SystemController>(TYPES.SystemController).to(SystemController).inSingletonScope()
systemContainer.bind<ShoppingCartController>(TYPES.ShoppingCartController).to(ShoppingCartController)
systemContainer.bind<MessageController>(TYPES.MessageController).to(MessageController)
systemContainer.bind<UserController>(TYPES.UserController).to(UserController)
systemContainer.bind<MarketplaceController>(TYPES.MarketplaceController).to(MarketplaceController).inSingletonScope()
systemContainer.bind<PurchaseController>(TYPES.PurchaseController).to(PurchaseController)
systemContainer.bind<SecurityController>(TYPES.SecurityController).to(SecurityController)
//external services
systemContainer.bind<PaymentServiceAdaptor>(TYPES.PaymentServiceAdaptor).to(PaymentServiceAdaptor)
systemContainer.bind<DeliveryServiceAdaptor>(TYPES.DeliveryServiceAdaptor).to(DeliveryServiceAdaptor)

if(config.env === "dev"){
    systemContainer.bind<IDeliveryService | null>(TYPES.realDeliveryService).toConstantValue(null);
    systemContainer.bind<IPaymentService | null>(TYPES.realPaymentService).toConstantValue(null);
    systemContainer.bind<string>("PaymentServiceName").toConstantValue("proxy payment service");
    systemContainer.bind<string>("DeliveryServiceName").toConstantValue("proxy delivery service");
} else {
    systemContainer.bind<IDeliveryService | null>(TYPES.realDeliveryService).to(DeliveryService);
    systemContainer.bind<IPaymentService | null>(TYPES.realPaymentService).to(PaymentService);
    systemContainer.bind<string>("PaymentServiceName").toConstantValue("real payment service")
    systemContainer.bind<string>("DeliveryServiceName").toConstantValue("real delivery service")
}



export  {systemContainer}