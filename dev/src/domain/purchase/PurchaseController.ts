import { Result } from "../../utilities/Result";
import { DeliveryServiceAdaptor } from "../external_services/DeliveryServiceAdaptor";
import { PaymentServiceAdaptor } from "../external_services/PaymentServiceAdaptor";
import { ShoppingBag } from "../marketplace/ShoppingBag";
import {IMessagePublisher, IMessageListener} from "../notifications/IEventPublishers";
import { ShopPurchaseMessage } from "../notifications/Message";
import { User } from "../user package/User";
import { BuyerOrder } from "./BuyerOrder";
import { ShopOrder } from "./ShopOrder";


export class PurchaseController implements IMessagePublisher<ShopPurchaseMessage> {
    subscriber: IMessageListener<ShopPurchaseMessage> | null;
    private paymentService: PaymentServiceAdaptor;
    private deliveryService: DeliveryServiceAdaptor;
    private buyerOrderCounter: number = 0;
    private shopOrderCounter: number = 0;
    private buyerOrders: Map<number, BuyerOrder[]>;
    private shopOrders: Map<number, ShopOrder[]>;

    constructor(paymentService: PaymentServiceAdaptor, deliveryService: DeliveryServiceAdaptor) {
        this.subscriber = null;
        this.buyerOrders = new Map<number, BuyerOrder[]>();
        this.shopOrders = new Map<number, ShopOrder[]>();
        this.paymentService = paymentService;
        this.deliveryService = deliveryService;
    }

    subscribe(sub: IMessageListener<ShopPurchaseMessage>) {
        this.subscriber = sub;
    }
    unsub(sub: IMessageListener<ShopPurchaseMessage>) {
        this.subscriber = null;
    }
    notify(message: ShopPurchaseMessage) {
        if(this.subscriber !== null)
            this.accept(this.subscriber, message);
        else
            throw new Error("No one to get the message");

    }
    accept(v: IMessageListener<ShopPurchaseMessage>, msg:ShopPurchaseMessage) {
        v.visitPurchaseEvent(msg)
    }

    setPaymentService(paymentService: PaymentServiceAdaptor){
        this.paymentService = paymentService;
    }

    setDeliveryService(deliveryService: DeliveryServiceAdaptor){
        this.deliveryService = deliveryService;
    }

    getPaymentService(){
        return this.paymentService;
    }

    getDeliveryService(){
        return this.deliveryService;
    }

    checkout(user: User): Result<void>{
        let shoppingCart = user.getShoppingCart();
        let totalCartPrice = 0;
        let shopOrders = shoppingCart.bags.map((bag: ShoppingBag) => {
            totalCartPrice += bag.totalPrice;
            let shopOrder =  new ShopOrder(this.shopOrderCounter, bag.shopId, bag.products, bag.totalPrice, this.getCurrTime());
            if (this.shopOrders.has(bag.shopId)){
                let orders = this.shopOrders.get(bag.shopId);
                orders?.push(shopOrder);
            }
            else{
                this.shopOrders.set(bag.shopId,[shopOrder])
            }
        });
        // this.paymentService.makePayment(totalCartPrice);
        // this.deliveryService.makeDelivery("details");
        let buyerOrder = new BuyerOrder(this.buyerOrderCounter,user.getId(), shopOrders, totalCartPrice, this.getCurrTime());
        if (this.buyerOrders.has(user.getId())){
            let orders = this.buyerOrders.get(user.getId());
            orders?.push(buyerOrder);
        }
        else{
            this.buyerOrders.set(user.getId(), [buyerOrder])
        }
        return new Result(true, undefined);
    }

    getCurrTime(): string{
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        return dateTime;
    }
}