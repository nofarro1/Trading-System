import {Container} from "inversify";
import {TYPES} from "./types";
import {SystemController} from "./src/domain/SystemController";
import {Service} from "./src/service/Service";
import {GuestService} from "./src/service/GuestService";
import {MarketplaceService} from "./src/service/MarketplaceService";
import {MemberService} from "./src/service/MemberService";
import {OrderService} from "./src/service/OrderService";
import {ShoppingCartService} from "./src/service/ShoppingCartService";
import {ShoppingCartController} from "./src/domain/marketplace/ShoppingCartController";
import {MessageController} from "./src/domain/notifications/MessageController";
import {UserController} from "./src/domain/user/UserController";
import {NotificationController} from "./src/domain/notifications/NotificationController";
import {MarketplaceController} from "./src/domain/marketplace/MarketplaceController";
import {PurchaseController} from "./src/domain/purchase/PurchaseController";
import {SecurityController} from "./src/domain/SecurityController";
import {PaymentServiceAdaptor} from "./src/domain/external_services/PaymentServiceAdaptor";
import {DeliveryServiceAdaptor} from "./src/domain/external_services/DeliveryServiceAdaptor";


const systemContainer = new Container();
//services
systemContainer.bind<Service>(TYPES.Service).to(Service)
systemContainer.bind<GuestService>(TYPES.GuestService).to(GuestService)
systemContainer.bind<MarketplaceService>(TYPES.MarketplaceService).to(MarketplaceService)
systemContainer.bind<MemberService>(TYPES.MemberService).to(MemberService)
systemContainer.bind<OrderService>(TYPES.OrderService).to(OrderService)
systemContainer.bind<ShoppingCartService>(TYPES.ShoppingCartService).to(ShoppingCartService)
//controllers
systemContainer.bind<SystemController>(TYPES.SystemController).to(SystemController).inSingletonScope()
systemContainer.bind<ShoppingCartController>(TYPES.ShoppingCartController).to(ShoppingCartController)
systemContainer.bind<MessageController>(TYPES.MessageController).to(MessageController)
systemContainer.bind<UserController>(TYPES.UserController).to(UserController)
systemContainer.bind<NotificationController>(TYPES.NotificationController).to(NotificationController)
systemContainer.bind<MarketplaceController>(TYPES.MarketplaceController).to(MarketplaceController)
systemContainer.bind<PurchaseController>(TYPES.PurchaseController).to(PurchaseController)
systemContainer.bind<SecurityController>(TYPES.SecurityController).to(SecurityController)
//external services
systemContainer.bind<PaymentServiceAdaptor>(TYPES.PaymentServiceAdaptor).to(PaymentServiceAdaptor)
systemContainer.bind<DeliveryServiceAdaptor>(TYPES.DeliveryServiceAdaptor).to(DeliveryServiceAdaptor)
systemContainer.bind<string>("PaymentServiceName").toConstantValue("default payment service")
systemContainer.bind<string>("DeliveryServiceName").toConstantValue("default delivery service")


export  {systemContainer}