import { Result } from "../../utilities/Result";
import { DeliveryServiceAdaptor } from "../external_services/DeliveryServiceAdaptor";
import { PaymentServiceAdaptor } from "../external_services/PaymentServiceAdaptor";
import { ShoppingBag } from "../marketplace/ShoppingBag";
import {IMessagePublisher, IMessageListener} from "../notifications/IEventPublishers";
import {ShopPurchaseMessage, ShopStatusChangedMessage} from "../notifications/Message";
import { Member } from "../user/Member";
import { BuyerOrder } from "./BuyerOrder";
import { ShopOrder } from "./ShopOrder";
import { logger}  from "../../helpers/logger"
;
import { Guest } from "../user/Guest";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";


@injectable()
export class PurchaseController implements IMessagePublisher<ShopPurchaseMessage> {
    protected subscribers: IMessageListener<ShopPurchaseMessage>[];
    private _paymentService: PaymentServiceAdaptor;
    private _deliveryService: DeliveryServiceAdaptor;
    private buyerOrderCounter: number = 0;
    private shopOrderCounter: number = 0;
    private _buyerOrders: Map<string, Set<string>>;
    private _shopOrders: Map<number, Set<string>>;
    
    
    constructor(@inject(TYPES.PaymentServiceAdaptor) paymentService: PaymentServiceAdaptor,@inject(TYPES.DeliveryServiceAdaptor) deliveryService: DeliveryServiceAdaptor) {
        this.subscribers = [];
        this._buyerOrders = new Map<string, Set<string>>();
        this._shopOrders = new Map<number, Set<string>>();
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
    public get buyerOrders(): Map<string, Set<string>> {
        return this._buyerOrders;
    }
    public get shopOrders(): Map<number, Set<string>> {
        return this._shopOrders;
    }
    subscribe(sub: IMessageListener<ShopPurchaseMessage>) {
        if(!this.subscribers.includes(sub)){
            this.subscribers.push(sub)
            logger.debug(`subscriber ${sub.constructor.name} sunsctibe to ${this.constructor.name}`)
        }
        logger.warn(`subscriber ${sub.constructor.name} already subscribed to ${this.constructor.name}`)
    }
    unsubscribe(sub: IMessageListener<ShopStatusChangedMessage>) {
        if(this.subscribers.includes(sub)){
            const inx = this.subscribers.findIndex((o) => o === sub)
            this.subscribers.splice(inx, inx+1)
            logger.debug(`subscriber ${sub.constructor.name} unsubscribed to ${this.constructor.name}`)
        }
        logger.warn(`subscriber ${sub.constructor.name} already subscribed to ${this.constructor.name}`)
    }
    notifySubscribers(message: ShopPurchaseMessage) {
        if(this.subscribers !== null)
            for(let sub of this.subscribers){
                this.accept(sub, message);
            } else
        throw new Error("No one to get the message");

    }
    accept(v: IMessageListener<ShopPurchaseMessage>, msg:ShopPurchaseMessage) {
        v.visitPurchaseEvent(msg)
    }

    checkout(user: Guest): Result<void>{
        let shoppingCart = user._shoppingCart;
        let totalCartPrice = 0;
        let buyerOrder = `Buyer Order Number: ${this.buyerOrderCounter} \nShopOrders: \n`;
        shoppingCart.bags.forEach((bag: ShoppingBag) => {
            let totalBagPrice = 0;
            let shopOrder = `Shop Order Number: ${this.shopOrderCounter} \nProduct: \nProduct Id,  Product Name, Full Price, Final Price `;
            this.shopOrderCounter++;
            bag.productsOnSale.forEach((products, sale) => {
                sale.applyDiscount(products);
            });
            bag.products.forEach((product) => {
                // TODO: check quantity somehow
                totalBagPrice += product[0].discountPrice;
                shopOrder += `${product[0].id}, ${product[0].name}, ${product[0].fullPrice}, ${product[0].discountPrice}\n`;
            });
            shopOrder += `Total Shop Order Price: ${totalBagPrice} \n`;
            buyerOrder += shopOrder;
            shopOrder += `Purchase Date: ${new Date().toLocaleString()} \n`;
            totalCartPrice += totalBagPrice;
            let orders = this.shopOrders.get(bag.shopId);
            if (!orders){
                orders = new Set<string>();
            }
            orders.add(shopOrder);
            this.shopOrders.set(bag.shopId, orders);
        });
        buyerOrder += `Total Cart Price: ${totalCartPrice}\n`;
        buyerOrder += `Purchase Date: ${new Date().toLocaleString()}\n`;
        // this.paymentService.makePayment(totalCartPrice);
        // this.deliveryService.makeDelivery("details");
        if( user instanceof Member){
            let orders = this.buyerOrders.get(user.username);
            if (!orders){
                orders = new Set<string>();
            }
            orders.add(buyerOrder);
            this.buyerOrders.set(user.username, orders);
            logger.info(`User ${user.username} made purchase. order#: ${this.buyerOrderCounter}`);
            this.buyerOrderCounter++;
            //check purchase And Discount Policies
        }
        else
            logger.info(`Guest ${user.session} made purchase. order#: ${this.buyerOrderCounter}`);
        return new Result(true, undefined);
        
    
    }
}