import { PaymentService } from "../domain/external_services/PaymentService";

export const TYPES = {
    SystemController: Symbol.for("SystemController"),
    Service: Symbol.for("Service"),
    GuestService: Symbol.for("GuestService"),
    MarketplaceService: Symbol.for("MarketplaceService"),
    MemberService: Symbol.for("MemberService"),
    OrderService: Symbol.for("OrderService"),
    ShoppingCartService: Symbol.for("ShoppingCartService"),
    ShoppingCartController: Symbol.for("ShoppingCartController"),
    MessageController: Symbol.for("MessageController"),
    UserController: Symbol.for("UserController"),
    MarketplaceController: Symbol.for("MarketplaceController"),
    PurchaseController: Symbol.for("PurchaseController"),
    SecurityController: Symbol.for("SecurityController"),
    PaymentServiceAdaptor: Symbol.for("PaymentServiceAdaptor"),
    DeliveryServiceAdaptor: Symbol.for("DeliveryServiceAdaptor"),
    NotificationService: Symbol.for("NotificationService"),
    PaymentService: Symbol.for("PaymentService"),
    DeliveryService: Symbol.for("DeliveryService"),
    ServiceName: Symbol.for("string"),
}