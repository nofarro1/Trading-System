import { Result } from "../../utilities/Result";
import { DeliveryServiceAdaptor } from "../external_services/DeliveryServiceAdaptor";
import { PaymentServiceAdaptor } from "../external_services/PaymentServiceAdaptor";
import { ShoppingBag } from "../marketplace/ShoppingBag";
import {IMessagePublisher, IMessageListener} from "../notifications/IEventPublishers";
import { ShopPurchaseMessage } from "../notifications/Message";
import { Guest } from "../user/Guest";
import { Member } from "../user/Member";
import { User } from "../user/User";
import { BuyerOrder } from "./BuyerOrder";
import { ShopOrder } from "./ShopOrder";
import { logger}  from "../../helpers/logger"
import { ShoppingCart } from "../marketplace/ShoppingCart";
import { urlToHttpOptions } from "url";
import { string } from "../../utilities/Utils";


export class PurchaseController implements IMessagePublisher<ShopPurchaseMessage> {
    private _subscriber: IMessageListener<ShopPurchaseMessage> | null;
    private _paymentService: PaymentServiceAdaptor;
    private _deliveryService: DeliveryServiceAdaptor;
    private buyerOrderCounter: number = 0;
    private shopOrderCounter: number = 0;
    private _buyerOrders: Map<string | number, Set<BuyerOrder>>;
    private _shopOrders: Map<number, Set<ShopOrder>>;
    
    
    constructor(paymentService: PaymentServiceAdaptor, deliveryService: DeliveryServiceAdaptor) {
        this._subscriber = null;
        this._buyerOrders = new Map<string | number, Set<BuyerOrder>>();
        this._shopOrders = new Map<number, Set<ShopOrder>>();
        this._paymentService = paymentService;
        this._deliveryService = deliveryService;
    }
    
    swapDeliveryService(deliveryService: DeliveryServiceAdaptor){
        this.deliveryService = deliveryService;
        logger.info(`[swapDeliveryService] Swap delivery service`)
    }

    swapPaymentService(paymentService: PaymentServiceAdaptor){
        this.paymentService = paymentService;
        logger.info(`[swapPaymentService] Swap payment service`)
    }

    public get subscribers(): IMessageListener<ShopPurchaseMessage> | null {
        return this._subscriber;
    }
    public set subscribers(value: IMessageListener<ShopPurchaseMessage> | null) {
        this._subscriber = value;
    }
    public get paymentService(): PaymentServiceAdaptor {
        return this._paymentService;
    }
    public set paymentService(value: PaymentServiceAdaptor) {
        this._paymentService = value;
    }
    public get deliveryService(): DeliveryServiceAdaptor {
        return this._deliveryService;
    }
    public set deliveryService(value: DeliveryServiceAdaptor) {
        this._deliveryService = value;
    }
    public get buyerOrders(): Map<string | number, Set<BuyerOrder>> {
        return this._buyerOrders;
    }
    public get shopOrders(): Map<number, Set<ShopOrder>> {
        return this._shopOrders;
    }
    subscribe(sub: IMessageListener<ShopPurchaseMessage>) {
        this.subscribers = sub;
    }
    unsubscribe(sub: IMessageListener<ShopPurchaseMessage>) {
        this.subscribers = null;
    }
    notifySubscribers(message: ShopPurchaseMessage) {
        if(this.subscribers !== null)
            this.accept(this.subscribers, message);
        else
            throw new Error("No one to get the message");

    }
    accept(v: IMessageListener<ShopPurchaseMessage>, msg:ShopPurchaseMessage) {
        v.visitPurchaseEvent(msg)
    }

    checkout(user: User): Result<void>{
        let shoppingCart = user._shoppingCart;
        let totalCartPrice = 0;
        shoppingCart.bags.forEach((bag: ShoppingBag) => {
            totalCartPrice += bag.totalPrice;
            let shopOrder =  new ShopOrder(this.shopOrderCounter, bag.shopId, bag.products, bag.totalPrice, new Date(Date.now()));
            if (this.shopOrders.has(bag.shopId)){
                let orders = this.shopOrders.get(bag.shopId);
                orders?.add(shopOrder);
            }
            else{
                let order = new Set<ShopOrder>();
                order.add(shopOrder);
                this.shopOrders.set(bag.shopId, order);
            }
            if (user instanceof Member)
                this.notifySubscribers(new ShopPurchaseMessage(shopOrder, new Set<string>(), user.username))
            // if (user instanceof SimpleGuest)
            //     // TODO: userid in ShopPurchaseMessage string | number
            //     this.notify(new ShopPurchaseMessage(shopOrder, new Set<UserID>(), user.id))
        });
        // this.paymentService.makePayment(totalCartPrice);
        // this.deliveryService.makeDelivery("details");
        if (user instanceof Member){
            if (this.buyerOrders.has(user.username)){
                let orders = this.buyerOrders.get(user.username);
                if(orders){
                    let buyerOrder = new BuyerOrder(this.buyerOrderCounter,user.username, orders, totalCartPrice, new Date(Date.now()));
                    orders.add(buyerOrder);
                    this.buyerOrders.set(user.username, orders);
                    this.buyerOrderCounter = this.buyerOrderCounter +1;
                    logger.info(`guest ${user.username} made checkout. order#: ${this.buyerOrderCounter}`);
                    // return new Result(true, buyerOrder);
                }
            }
            else{
                let orders = new Set<BuyerOrder>();
                let buyerOrder = new BuyerOrder(this.buyerOrderCounter,user.username, orders, totalCartPrice, new Date(Date.now()));
                orders.add(buyerOrder);
                this.buyerOrders.set(user.username, orders);
                this.buyerOrderCounter = this.buyerOrderCounter +1;
                // return new Result(true, buyerOrder);
            }
            logger.info(`member ${user.username} made checkout. order#: ${this.buyerOrderCounter}`);
        }
        if (user instanceof Guest){
            if (this.buyerOrders.has(user.id)){
                let orders = this.buyerOrders.get(user.id);
                if(orders){
                    let buyerOrder = new BuyerOrder(this.buyerOrderCounter,user.id, orders, totalCartPrice, new Date(Date.now()));
                    orders?.add(buyerOrder);
                    this.buyerOrders.set(user.id, orders);
                    this.buyerOrderCounter = this.buyerOrderCounter +1;
                    logger.info(`guest ${user.id} made checkout. order#: ${this.buyerOrderCounter}`);
                    // return new Result(true, buyerOrder);
                }
            }
            else{
                let orders = new Set<BuyerOrder>();
                let buyerOrder = new BuyerOrder(this.buyerOrderCounter,user.id, orders, totalCartPrice, new Date(Date.now()));
                orders.add(buyerOrder);
                this.buyerOrders.set(user.id, orders);
                this.buyerOrderCounter = this.buyerOrderCounter +1;
                logger.info(`guest ${user.id} made checkout. order#: ${this.buyerOrderCounter}`);
                // return new Result(true, buyerOrder);
            }
        }
        return new Result(false, undefined);
    }
    // getCurrTime(): string{
    //     var today = new Date();
    //     var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    //     var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //     var dateTime = date+' '+time;
    //     return dateTime;
    // }
}