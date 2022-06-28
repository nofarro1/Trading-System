import {SecurityController} from "./SecurityController";

import {
    DiscountData,
    ImmediatePurchaseData,
    LoginData,
    NewProductData,
    NewRoleData,
    RegisterMemberData
} from "../utilities/DataObjects";
import {Member} from "./user/Member";
import {ExternalServiceType} from "../utilities/Utils";
import {MarketplaceController} from "./marketplace/MarketplaceController";
import {ShoppingCartController} from "./user/ShoppingCartController";
import {PurchaseController} from "./purchase/PurchaseController";
import {MessageController} from "./notifications/MessageController";
import {checkRes, Result} from "../utilities/Result";
import {UserController} from "./user/UserController";
import {Guest} from "./user/Guest";
import {logger} from "../helpers/logger";
import {JobType, ProductCategory, SearchType} from "../utilities/Enums";
import {Permissions} from "../utilities/Permissions";
import {PaymentServiceAdaptor} from "./external_services/PaymentServiceAdaptor";
import {DeliveryServiceAdaptor} from "./external_services/DeliveryServiceAdaptor";

import {
    toSimpleDiscountDescriber,
    toSimpleGuest,
    toSimpleMember,
    toSimpleProduct,
    toSimpleProducts,
    toSimpleShop,
    toSimpleShoppingCart
} from "../utilities/simple_objects/SimpleObjectFactory";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";
import {SimpleProduct} from "../utilities/simple_objects/marketplace/SimpleProduct";
import {SimpleShop} from "../utilities/simple_objects/marketplace/SimpleShop";
import {SimpleShoppingCart} from "../utilities/simple_objects/user/SimpleShoppingCart";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";
import {inject, injectable} from "inversify";
import {TYPES} from "../helpers/types";
import "reflect-metadata";
import {
    ImmediatePurchasePolicyComponent
} from "./marketplace/DiscountAndPurchasePolicies/Components/ImmediatePurchasePolicyComponent";
import {SimpleDiscountDescriber} from "../utilities/simple_objects/marketplace/SimpleDiscountDescriber";
import {DiscountComponent} from "./marketplace/DiscountAndPurchasePolicies/Components/DiscountComponent";
import {ServiceSettings} from "../utilities/Types";
import {PaymentService} from "./external_services/PaymentService";
import {DeliveryService} from "./external_services/DeliveryService";
import {PaymentDetails} from "./external_services/IPaymentService";
import {DeliveryDetails} from "./external_services/IDeliveryService";
import {Offer} from "./user/Offer";

@injectable()
export class SystemController {
    mpController: MarketplaceController;
    scController: ShoppingCartController;
    uController: UserController;
    pController: PurchaseController;
    mController: MessageController;
    securityController: SecurityController;

    constructor(
        @inject(TYPES.MarketplaceController) mpController: MarketplaceController,
        @inject(TYPES.ShoppingCartController) scController: ShoppingCartController,
        @inject(TYPES.UserController) uController: UserController,
        @inject(TYPES.PurchaseController) pController: PurchaseController,
        @inject(TYPES.MessageController) msgController: MessageController,
        @inject(TYPES.SecurityController) sController: SecurityController,
        @inject("adminUsername") adminUsername: string,
        @inject("adminPassword") adminPassword: string
    ) {
        this.mpController = mpController;
        this.scController = scController;
        this.uController = uController;
        this.pController = pController;
        this.mController = msgController;
        this.securityController = sController;
        //todo: configure dependencies between controllers
        this.pController.subscribe(this.mController);
        this.mpController.subscribe(this.mController);

        SystemController.createDefaultAdmin(
            this.securityController,
            this.uController,
            this.scController,
            this.mController,
            {
                username: "admin",
                password: "adminadmin",
            }
        ).then((defaultAdmin) => {
            if (defaultAdmin.data === undefined) {
                logger.error(
                    "failed to initialize system. default admin registration failed"
                );
                throw new Error("failed to register default admin member");
            } else {

                logger.info("system controller initialize successfully");
            }
        }).then(async () => {
            return await this.securityController.checkPassword(adminUsername, adminPassword);
        }).then((verified) => {
            if (!verified) {
                logger.error("failed to verify the admin on system start up");
                throw new Error("failed to verify the admin on system start up");
            }
        })


    }

    // static initialize(): SystemController {
    //
    //
    //     //create all services
    //     let marketplace = new MarketplaceController();
    //     let shoppingCart = new ShoppingCartController();
    //     let user = new UserController()
    //     let purchase = new PurchaseController(new PaymentServiceAdaptor("Pservice", undefined), new DeliveryServiceAdaptor("Dservice", undefined));
    //     let messages = new MessageController();
    //     let notifications = new NotificationController();
    //     let security = new SecurityController();
    //
    //
    //     const defaultAdmin = this.createDefaultAdmin(security, user, shoppingCart, messages, {
    //         username: "admin",
    //         password: "adminadmin"
    //     })
    //     return new SystemController(marketplace, shoppingCart, user, purchase, messages, security, notifications);
    //
    // }

    private static async createDefaultAdmin(
        security: SecurityController,
        user: UserController,
        cart: ShoppingCartController,
        box: MessageController,
        newMember: RegisterMemberData
    ) {
        try {
            security.accessMarketplace("-1");
            await security.register("-1", newMember.username, newMember.password);
        } catch (e: any) {
            return new Result(false, undefined, e.message);
        }

        cart.addCart(newMember.username);
        let res = await cart.getCart(newMember.username);
        if (res.ok) {
            let mb = box.addMessageBox(newMember.username);
            if (mb.ok) {
                const memRes = user.addMember("-1", newMember.username);
                if (memRes.ok) return new Result(true, memRes.data, "register success");
            }
            return new Result(false, undefined, "could not Register");
        }
        return new Result(false, undefined, "could not Register");

    }

    private authenticateMarketVisitor<T>(
        sessionId: string,
        callback: (id: string) => T
    ) {
        // logger.warn("[authenticateMarketVisitor] start");
        const userId: string = this.securityController.hasActiveSession(sessionId);
        if (userId.length === 0) {
            return new Result(false, undefined, "this is not one of our visitors!");
        }
        // logger.warn("[authenticateMarketVisitor] exit");
        return callback(userId);
    }

    private async authenticateMarketVisitorAsync<T>(
        sessionId: string,
        callback: (id: string) => Promise<T>
    ) {
        logger.warn("[authenticateMarketVisitor] start");
        const userId: string = this.securityController.hasActiveSession(sessionId);
        if (userId.length === 0) {
            return new Result(false, undefined, "this is not one of our visitors!");
        }
        logger.warn("[authenticateMarketVisitor] exit");
        return await callback(userId);
    }

    /*------------------------------------Guest management actions----------------------------------------------*/

    //General Guest - Use-Case 1
    async accessMarketplace(session: string): Promise<Result<void | SimpleGuest>> {
        logger.warn(`[systemController/accessMarketplace] start w/ ${session}`);
        let newGuest: Result<Guest> = this.uController.createGuest(session);
        if (!newGuest.ok) {
            return new Result(false, undefined);
        }
        const guest = newGuest.data;
        let res = this.scController.addCart(guest.session);
        if (checkRes(res)) {
            guest.shoppingCart = res.data
        }
        this.securityController.accessMarketplace(guest.session);
        return new Result(true, toSimpleGuest(guest));
    }

    //General Member - Use-Case 1 //General Guest - Use-Case 2
    async exitMarketplace(sessionId: string): Promise<Result<void>> {
        const callback = async (id: string) => {
            let toLogout = id;
            let res = await this.logout(sessionId); // try to log out member if session id is connected to a member ,returns a guest on success. on fail the id is all ready a guest, and we can preside
            if (checkRes(res)) {
                toLogout = res.data.guestID;
            }
            try {
                this.securityController.exitMarketplace(toLogout);
                const toExit = this.uController.getGuest(toLogout);
                const delCart = await this.scController.removeCart(toLogout);
                if (checkRes(toExit) && checkRes(delCart)) {
                    this.uController.exitGuest(toExit.data);
                    return new Result(true, undefined, "bye bye!");
                }
                return new Result(
                    false,
                    undefined,
                    "for some reason guest was not deleted"
                );
            } catch (error: any) {
                return new Result(false, undefined, error.message);
            }
        };

        return this.authenticateMarketVisitorAsync(sessionId, callback);
    }

    // disconnectGuest(guestId: UserID): void {
    //     let guest = `this is guest ${guestId}`;
    //     // gController.removeGuest(guest)
    //     //scController.removeShoppingCart(guest.SimpleShoppingCart.id);
    //
    //
    // }
    //General Guest - Use-Case 4
    async login(sessionId: string, d: LoginData): Promise<Result<void | SimpleMember>> {
        const secCallback = async (id: string): Promise<Result<void | SimpleMember>> => {
            //if success get the member_id
            try {
                await this.securityController.login(sessionId, d.username, d.password);
            } catch (e: any) {
                return new Result(false, undefined, e.message);
            }
            //retrieve member and add it to active users
            const res = await this.uController.getMember(d.username);
            if (checkRes(res)) {
                const user: Member = res.data
                user.session = sessionId;
                //delete the guest
                const toExit = this.uController.getGuest(sessionId);
                const delCart = await this.scController.removeCart(sessionId);
                if (checkRes(toExit) && checkRes(delCart)) {
                    this.uController.exitGuest(toExit.data);
                    return new Result(true, toSimpleMember(user), "member logged in");
                }
                return new Result(true, undefined, res.message);
            } else {
                return new Result(false, undefined, "member does not exist");
            }
        }

        return this.authenticateMarketVisitorAsync(sessionId, secCallback);
    }

    //General Member - Use-Case 1
    async logout(sessionID: string): Promise<Result<SimpleGuest | void>> {
        const secCallback = async (id: string) => {
            // remove member and live notification
            try {
                this.securityController.logout(sessionID, id);
                return this.accessMarketplace(sessionID);
            } catch (e: any) {
                return new Result(false, undefined, e.message);
            }
        };
        return this.authenticateMarketVisitorAsync(sessionID, secCallback);
    }

    //General Guest - Use-Case 3
    async registerMember(
        sessionID: string,
        newMember: RegisterMemberData
    ): Promise<Result<SimpleMember | void>> {
        logger.warn("[SystemController/registerMember] in register member - system controller");
        const secCallback = async (id: string): Promise<Result<SimpleMember | void>> => {
            //register process
            const res = await this.register(id, newMember);
            if (res.ok) {
                logger.warn("[SystemController/registerMember] finish - member returned");
                return new Result<SimpleMember | void>(true, res.data, res.message);
            } else {
                logger.warn("[SystemController/registerMember] finish - there was error! undefined returned");
                return new Result(false, undefined, res.message);
            }
        };
        return this.authenticateMarketVisitorAsync(sessionID, secCallback);
    }

    private async register(
        sessionId: string,
        newMember: RegisterMemberData
    ): Promise<Result<SimpleMember | void>> {
        try {
            // console.log(`[SystemController/register] start w/${newMember.username}`)
            await this.securityController.register(
                sessionId,
                newMember.username,
                newMember.password
            );
        } catch (e: any) {
            return new Result(false, undefined, e.message);
        }
        let add = this.scController.addCart(newMember.username);
        let res = await this.scController.getCart(newMember.username);
        if (checkRes(res)) {
            let mb = this.mController.addMessageBox(newMember.username);
            if (checkRes(mb)) {
                const memRes = this.uController.addMember(
                    sessionId,
                    newMember.username
                );
                if (checkRes(memRes))
                    return new Result(
                        true,
                        toSimpleMember(memRes.data),
                        "register success"
                    );
            }
            return new Result(false, undefined, "could not Register");
        }
        return new Result(false, undefined, "could not Register");
    }

    /*------------------------------------Marketplace Interaction actions----------------------------------------------*/

    async getProduct(
        sessionID: string,
        shopId: number,
        productId: number
    ): Promise<Result<SimpleProduct | void>> {
        //market visitor authentication

        return this.authenticateMarketVisitor(sessionID, async () => {
            const res = await this.mpController.getProduct(shopId, productId);
            if (checkRes(res)) {
                return new Result(true, toSimpleProduct(res.data), res.message);
            }
            return new Result(false, undefined, "could not get product");
        });
    }

    // nice to have
    // getProducts(user: Id, productIds: number[]): Result<SimpleProduct[]> {
    //     return new Result(false, null, "no implementation");
    // }

    async getShop(sessionId: string, shopId: number): Promise<Result<SimpleShop | void>> {
        return this.authenticateMarketVisitor(sessionId, async () => {
            const res = await this.mpController.getShopInfo(shopId);
            if (checkRes(res)) {
                return new Result(true, toSimpleShop(res.data) , res.message);
            }
            return new Result(false, undefined, "could not get product");
        });
    }

    // nice to have
    // getShops(user: Id, shopIds: Id[]): Result<SimpleShop[]> {
    //     return this.mpController.getShop(shopid)
    // }

    // getShops(): Result<SimpleShop[] | void> {
    //     console.log("[SystemController/getShops] start");
    //     const shops: SimpleShop[] = this.mpController.Shops.map(toSimpleShop);
    //     return Result.Ok(shops);
    // }

    async getShops(sessionId: string): Promise<Result<SimpleShop[] | void>> {
        return this.authenticateMarketVisitor(sessionId, async (id) => {
            const shops: SimpleShop[] = await this.mpController.Shops.map(toSimpleShop);
            return Result.Ok(shops);
        });
    }

    //Guest Payment - Use-Case 2
    async searchProducts(
        sessionId: string,
        searchBy: SearchType,
        searchTerm: string | ProductCategory,
        filter?: any
    ): Promise<Result<SimpleProduct[] | void>> {
        //market visitor authentication
        return this.authenticateMarketVisitor(sessionId, async () => {
            const res = await this.mpController.searchProduct(searchBy, searchTerm);
            if (checkRes(res)) {
                return new Result(true, toSimpleProducts(res.data), res.message);
            }
            return new Result(false, undefined, "could not get product");
        });
    }

    //Guest Payment - Use-Case 4.1
    async addToCart(
        sessionId: string,
        shopId: number,
        productId: number,
        quantity: number
    ): Promise<Result<void>> {
        const authCallback = async (id: string) => {
            const productRes = await this.mpController.getProduct(shopId, productId);
            if (checkRes(productRes))
                return this.scController.addProduct(id, productRes.data, quantity);
            else {
                return new Result(false, undefined, productRes.message);
            }
        };
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Guest Payment - Use-Case 4.2
    async getCart(sessionId: string): Promise<Result<SimpleShoppingCart | void>> {
        const authCallback = async (id: string): Promise<Result<SimpleShoppingCart | void>> => {
            const result = await this.scController.getCart(id);
            return checkRes(result)
            ? new Result(true, toSimpleShoppingCart(id, result.data))
                : new Result(false, undefined, result.message);
        };
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Guest Payment - Use-Case 4.4
    async editCart(sessionId: string, shopId: number, productId: number, quantity: number, additionalData?: any): Promise<Result<void>> {
        const authCallback = async (id: string) => {
            const productRes = await this.mpController.getProduct(shopId, productId);
            if (checkRes(productRes)) {
                return this.scController.updateProductQuantity(id, productRes.data, quantity)
            } else
                return new Result(false, undefined, "product not found")

        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Guest Payment - Use-Case 4.3
    async removeProductFromCart(sessionId: string, shopId: number, productId: number): Promise<Result<void>> {
        const authCallback = async (id: string) => {
            const productRes = await this.mpController.getProduct(shopId, productId);
            if (checkRes(productRes)) {
                return this.scController.removeProduct(id, productRes.data)
            }
            return new Result(false, undefined, "product not found")
        }
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Guest Payment - Use-Case 5
    async checkout(
        sessionId: string,
        paymentDetails: PaymentDetails,
        deliveryDetails: DeliveryDetails
    ): Promise<Result<void>> {
        return Promise.resolve(
            this.authenticateMarketVisitor(sessionId, async (id) => {
                let result = this.uController.getGuest(id);
                let resultMm = this.uController.getMember(id);
                let userObj: Guest;
                if (checkRes(result)) {
                    userObj = result.data;
                    return await this.pController.checkout(
                        userObj,
                        paymentDetails,
                        deliveryDetails
                    );
                } else if (checkRes(resultMm)) {
                    userObj = resultMm.data;
                    return await this.pController.checkout(
                        userObj,
                        paymentDetails,
                        deliveryDetails
                    );
                }
                return new Result(false, undefined, "Unable to check out this user");
            })
        );
    }

    /*------------------------------------Marketplace Interaction actions----------------------------------------------*/

    //Member Payment - Use-Case 2
    async setUpShop(sessionId: string, shopName: string): Promise<Result<void | SimpleShop>> {
        const authCallback = async (founderId: string): Promise<Result<void | SimpleShop>> => {
            const result = await this.uController.getMember(founderId);
            if (checkRes(result)) {
                let shop = this.mpController.setUpShop(founderId, shopName)
                if (checkRes(shop)) {
                    this.uController.addRole(founderId, founderId, JobType.Founder, shop.data.id, new Set([Permissions.ShopOwner]));
                    return new Result(true, toSimpleShop(shop.data), "shop has opened");
                }
                return new Result(false, undefined, "failed to set up shop.")
            } else {
                return new Result(false, undefined, "you have to be a member to open a shop.")
            }
            //found shop

            // insert role
        };
        return this.authenticateMarketVisitor(sessionId, authCallback);
    }

    //Shop Owner - Use-Case 1.1
    async addProduct(sessionId: string, p: NewProductData): Promise<Result<SimpleProduct | void>> {
        const authCallback = async (id: string) => {
            if (this.uController.checkPermission(id, p.shopId, Permissions.AddProduct).data ||
                this.uController.checkPermission(id, p.shopId, Permissions.ShopOwner).data) {

                let res = await this.mpController.addProductToShop(
                    p.shopId, p.productCategory, p.productName,
                    p.quantity, p.fullPrice, p.productDesc);

                if (checkRes(res)) {
                    return new Result(true, toSimpleProduct(res.data), res.message);
                }
            }
            return new Result(false, undefined, "member does not have permissions");
        };
        return this.authenticateMarketVisitorAsync(sessionId, authCallback);
    }

    //Shop Owner - Use-Case 1.3
    async updateProductQuantity(sessionId: string, shop: number, product: number, quantity: number): Promise<Result<void>> {
        const authCallback = async (id: string): Promise<Result<void>> => {
            if (this.uController.checkPermission(id, shop, Permissions.ModifyProduct).data ||
                this.uController.checkPermission(id, shop, Permissions.ShopOwner).data) {
                return this.mpController.updateProductQuantity(shop, product, quantity)
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitorAsync(sessionId, authCallback);
    }

    //Shop Owner - Use-Case 1.2
    async deleteProduct(sessId: string, shop: number, product: number): Promise<Result<void>> {
        const authCallback = async (id: string): Promise<Result<void>> => {
            if (this.uController.checkPermission(id, shop, Permissions.RemoveProduct).data ||
                this.uController.checkPermission(id, shop, Permissions.ShopOwner).data) {
                return this.mpController.removeProductFromShop(shop, product);
            }
            return new Result(false, undefined, "member does not have permissions");
        }
        return this.authenticateMarketVisitorAsync(sessId, authCallback);
    }

    //Shop Owner - Use-Case 9
    async deactivateShop(sessId: string, shop: number): Promise<Result<void>> {
        return this.authenticateMarketVisitorAsync(sessId, async (id: string) => {
            if (this.uController.checkPermission(id, shop, Permissions.CloseShop).data ||
                this.uController.checkPermission(id, shop, Permissions.ShopOwner).data) {
                return this.mpController.closeShop(id, shop)
            }
            return Promise.resolve(new Result(false, undefined, "no permission"))
        })
    }

    //todo; undo commet  when missing the methods in marketplace controller are declared
    async getDiscounts(
        sessId: string,
        shopId: number
    ): Promise<Result<SimpleDiscountDescriber[] | void>> {
        return this.authenticateMarketVisitorAsync(sessId, async () => {
            const discounts: DiscountComponent[] =
                this.mpController.getDiscounts(shopId);
            return Result.Ok(discounts.map(toSimpleDiscountDescriber));
        });
    }

    // getDiscount(
    //     sessId: string,
    //     shopId: number
    // ): Result<SimpleDiscountDescriber | void> {
    //     return this.authenticateMarketVisitor(sessId, () => {
    //         const discounts: DiscountComponent =
    //             this.mpController.getDiscount(shopId);
    //         return Result.Ok(discounts);
    //     });
    // }

    async addDiscount(
        sessId: string,
        shopId: number,
        discount: DiscountData
    ): Promise<Result<number | void>> {
        return this.authenticateMarketVisitorAsync(sessId, async (userId) => {
            if (
                this.uController.checkPermission(
                    userId,
                    shopId,
                    Permissions.AddDiscount
                ).data ||
                this.uController.checkPermission(userId, shopId, Permissions.ShopOwner)
                    .data
            ) {
                const res = await this.mpController.addDiscount(shopId, discount);
                if (checkRes(res)) {
                    return Result.Ok(res.data, `new discount add with Id ${res.data}`);
                }
                return Result.Fail(
                    "was unable to add the discount. reason: " + res.message
                );
            }
            return Result.Fail("No permissions to add discounts to shop " + shopId);
        });
    }

    async removeDiscount(sessId: string, shopId: number, idDisc: number): Promise<Result<void>> {
        return this.authenticateMarketVisitorAsync(sessId, async (userId) => {
            if (
                this.uController.checkPermission(
                    userId,
                    shopId,
                    Permissions.RemoveDiscount
                ).data ||
                this.uController.checkPermission(userId, shopId, Permissions.ShopOwner)
                    .data
            ) {
                const res: Result<void> = await this.mpController.removeDiscount(
                    shopId,
                    idDisc
                );
                if (checkRes(res)) {
                    return Result.Ok(res.data, `new discount add with Id ${res.data}`);
                }
                return res;
            }
            return Result.Fail("No permissions to add discounts to shop " + shopId);
        });
    }

    async getPolicies(
        sessId: string,
        shopId: number
    ): Promise<Result<ImmediatePurchasePolicyComponent[]>> {
        return this.authenticateMarketVisitorAsync(sessId, async (userId) => {
            if (
                this.uController.checkPermission(
                    userId,
                    shopId,
                    Permissions.AddPurchasePolicy
                ).data ||
                this.uController.checkPermission(userId, shopId, Permissions.ShopOwner)
                    .data
            ) {
                const res = this.mpController.getPolicies(shopId);
                if (checkRes(res)) {
                    return Result.Ok(res.data, `new discount add with Id ${res.data}`);
                }
                return Result.Fail(
                    "was unable to add the discount. reason: " + res.message
                );
            }
            return Result.Fail("No permissions to add discounts to shop " + shopId);
        });
    }

    async addPurchasePolicy(
        sessId: string,
        shopId: number,
        puPolicy: ImmediatePurchaseData
    ): Promise<Result<number | void>> {
        return this.authenticateMarketVisitorAsync(sessId, async (userId) => {
            if (this.uController.checkPermission(userId, shopId, Permissions.AddPurchasePolicy).data ||
                this.uController.checkPermission(userId, shopId, Permissions.ShopOwner).data) {
                const res = await this.mpController.addPurchasePolicy(shopId, puPolicy);
                if (checkRes(res)) {
                    return Result.Ok(res.data, `new discount add with Id ${res.data}`);
                }
                return Result.Fail(
                    "was unable to add the discount. reason: " + res.message
                );
            }
            return Result.Fail("No permissions to add discounts to shop " + shopId);
        });
    }

    async removePurchasePolicy(
        sessId: string,
        shopId: number,
        idPuPolicy: number
    ): Promise<Result<void>> {
        return this.authenticateMarketVisitorAsync(sessId, async (userId) => {
            if (
                this.uController.checkPermission(
                    userId,
                    shopId,
                    Permissions.AddPurchasePolicy
                ).data ||
                this.uController.checkPermission(userId, shopId, Permissions.ShopOwner)
                    .data
            ) {
                const res = await this.mpController.removePurchasePolicy(shopId, idPuPolicy);
                if (checkRes(res)) {
                    return Result.Ok(res.data, `new discount add with Id ${res.data}`);
                }
                return res;
            }
            return Result.Fail("No permissions to add discounts to shop " + shopId);
        });
    }

    /*-----------------------------------shop Personnel Actions actions----------------------------------------------*/

    async appointShopOwner(sessionId: string, r: NewRoleData): Promise<Result<void>> {
        const authCallback = async (id: string) => {
            if (this.uController.checkPermission(id, r.shopId, Permissions.AddShopOwner).data ||
                this.uController.checkPermission(id, r.shopId, Permissions.ShopOwner).data) {
                const result = this.uController.addRole(r.assigner, r.member, JobType.Owner, r.shopId, new Set(r.permissions.concat(Permissions.ShopOwner)))
                if (checkRes(result)) {
                    return this.mpController.appointShopOwner(r.member, r.shopId)
                }
                return new Result(false, undefined, "failed to add the role to the user")
            }
            return new Result(false, undefined, "no permissions to appoint shopOwner")
        }
        return this.authenticateMarketVisitorAsync(sessionId, authCallback)
    }


    //Shop Owner - Use-Case 6
    async appointShopManager(sessionId: string, r: NewRoleData): Promise<Result<void>> {
        const authCallback = async (appointerId: string) => {
            if (this.uController.checkPermission(appointerId, r.shopId, Permissions.AddShopManager).data ||
                this.uController.checkPermission(appointerId, r.shopId, Permissions.ShopOwner).data) {
                const result = this.uController.addRole(r.assigner, r.member, JobType.Manager, r.shopId, new Set(r.permissions)) //todo: adding an assigner to the method?
                if (result.ok) {
                    return this.mpController.appointShopManager(r.member, r.shopId)
                }
                return new Result(false, undefined, "failed to add role to member");
            }
            return new Result(false, undefined, "no permissions to appoint shopOwner")
        }
        return this.authenticateMarketVisitorAsync(sessionId, authCallback)
    }

    /* not for this version


          removeShopManager(toRemove: Id, remover: Id, shop: SimpleShop): Result<void> {
              return new Result(false, null, "no implementation");
          }

          removeShopOwner(toRemove: Id, remover: Id, shop: SimpleShop): Result<void> {
              return new Result(false, null, "no implementation");
          }
      */

    //Shop Owner - Use-Case 7.1
    async addShopManagerPermission(sessionId: string, manager: string, shop: number, permission: Permissions): Promise<Result<void>> {
        const authCallback = async (ownerId: string) => {
            if (this.uController.checkPermission(ownerId, shop, Permissions.AddPermission).data ||
                this.uController.checkPermission(ownerId, shop, Permissions.ShopOwner).data) {
                return this.uController.addPermission(manager, shop, permission)
            } else {
                return new Result(false, undefined, "No permission to add permissions");
            }
        }
        return this.authenticateMarketVisitorAsync(sessionId, authCallback)
    }

    //Shop Owner - Use-Case 7.2
    async removeShopManagerPermission(sessionId: string, manager: string, shop: number, permission: Permissions): Promise<Result<void>> {
        const authCallback = async (id: string) => {
            if (this.uController.checkPermission(id, shop, Permissions.RemovePermission).data ||
                this.uController.checkPermission(id, shop, Permissions.ShopOwner).data) {
                return this.uController.removePermission(manager, shop, permission)
            } else {
                return new Result(false, undefined, "No permission to add permissions");
            }
        }
        return this.authenticateMarketVisitorAsync(sessionId, authCallback)
    }

    async reactivateShop(sessId: string, shop: number): Promise<Result<void>> {
        return this.authenticateMarketVisitorAsync(sessId, async (id: string) => {
            if (this.uController.checkPermission(id, shop, Permissions.ReopenShop).data ||
                this.uController.checkPermission(id, shop, Permissions.ShopOwner).data) {
                return this.mpController.reopenShop(id, shop)
            }
            return new Result(false, undefined, "no permission")
        })
    }

    //Shop Owner - Use-Case 11
    async getPersonnelInfoOfShop(sessId: string, shop: number): Promise<Result<SimpleMember[] | void>> {
        const callback = async (id: string) => {
            if (!this.uController.checkPermission(id, shop, Permissions.RequestPersonnelInfo).data ||
                !this.uController.checkPermission(id, shop, Permissions.ShopOwner).data) {
                return new Result(false, undefined, "no permission");
            }
            let shopRes = await this.mpController.getShopInfo(shop);
            if (checkRes(shopRes)) {
                let data = shopRes.data;
                let collectedMembers: Member[] = [];
                [...data.shopManagers, ...data.shopOwners].forEach((id) => {
                    let res = this.uController.getMember(id);
                    if (checkRes(res)) {
                        collectedMembers.push(res.data);
                    }
                });
                return new Result(true, collectedMembers.map(toSimpleMember),)
            }

            return new Result(false, [], "not shop with that Id exists");
        };
        return this.authenticateMarketVisitorAsync(sessId, callback);
    }

    //Shop Owner - Use-Case 13
    //System Admin - Use-Case 4
    async getShopPurchases(sessId: string, shop: number, startDate: Date, endDate: Date, filter?: any): Promise<Result<string[] | void>> {

        const callback = async (id: string) => {
            //check if can preview History
            if (!this.uController.checkPermission(id, shop, Permissions.GetPurchaseHistory).data ||
                !this.uController.checkPermission(id, shop, Permissions.ShopOwner).data) {
                return new Result(false, undefined, "no permission");
            }
            let orders: string[] = this.pController.shopOrders.has(shop) ?
                [...(this.pController.shopOrders.get(shop))] : []
            return new Result(true, orders, orders.length !== 0 ? undefined : "no SimpleShop order were found");
        }

        return this.authenticateMarketVisitorAsync(sessId, callback);
    }

    /*-----------------------------------shop Personnel Actions actions----------------------------------------------*/

    //System Admin actions
    //General Admin - Use-Case 0
    async registerAsAdmin(sessionID: string, registrationData: RegisterMemberData, adminSecretKey?: string): Promise<Result<void>> {
        if (adminSecretKey === null || adminSecretKey !== "Edan Rules") {
            return new Result(false, undefined, "admin key not correct");
        }
        let admin = await this.register(sessionID, {
            username: registrationData.username,
            password: registrationData.password
        });
        if (admin.ok) {
            this.uController.addRole("admin", registrationData.username, JobType.admin, -1, new Set([Permissions.AdminControl]))
            return new Result(true, undefined, "new admin is added")
        }
        return new Result(false, undefined, "admin name cannot be registered");
    }

    async checkAdminPermissions(sessionID: string, admin_username: string, admin_password: string): Promise<Result<boolean>> {
        return this.authenticateMarketVisitorAsync(sessionID, async (username) => {
            if (await this.securityController.checkPassword(username, admin_password)) {
                return this.uController.checkPermission(admin_username, -1, Permissions.AdminControl);
            } else {
                return Result.Fail("password does not match");
            }
        })

    }


    async editConnectionWithExternalService(sessionID: string, admin: string, type: ExternalServiceType, settings: ServiceSettings): Promise<Result<void>> {
        return this.authenticateMarketVisitorAsync(admin, async (id: string) => {
            if (!this.uController.checkPermission(id, -1, Permissions.AdminControl)) {
                return new Result(false, undefined, "no admin Privileges");
            }
            if (type === ExternalServiceType.Delivery)
                this.pController.deliveryService.editServiceSettings(settings);
            else
                this.pController.paymentService.editServiceSettings(settings)

            return new Result(true, undefined, "services updated");
        });
    }

    // swapConnectionWithExternalService(
    //   sessionID: string,
    //   admin: string,
    //   type: ExternalServiceType,
    //   newServiceName: string
    // ): Result<void> {
    //   return this.authenticateMarketVisitor(admin, (id: string) => {
    //     if (!this.uController.checkPermission(id, -1, Permissions.AdminControl)) {
    //       return new Result(false, undefined, "no admin Privileges");
    //     }
    //     if (type === ExternalServiceType.Delivery)
    //       this.pController.swapDeliveryService(
    //         new DeliveryServiceAdaptor(
    //           newServiceName,
    //           new DeliveryService(newServiceName)
    //         )
    //       );
    //     else
    //       this.pController.swapPaymentService(
    //         new PaymentServiceAdaptor(
    //           newServiceName,
    //           new PaymentService(newServiceName)
    //         )
    //       );

    //     return new Result(true, undefined, "services swapped");
    //   });
    // }


    // editConnectionWithExternalService(sessionID: string, admin: string, type: ExternalServiceType, settings: ServiceSettings): Result<void> {
    //     return this.authenticateMarketVisitor(admin, (id: string) => {
    //         if (!this.uController.checkPermission(id, -1, Permissions.AdminControl)) {
    //             return new Result(false, undefined, "no admin Privileges");
    //         }
    //         if (type === ExternalServiceType.Delivery)
    //             this.pController.deliveryService.editServiceSettings(settings);
    //         else
    //             this.pController.paymentService.editServiceSettings(settings)

    //         return new Result(true, undefined, "services updated");

    //     })
    // }

    async swapConnectionWithExternalService(sessionID: string, admin: string, type: ExternalServiceType, newServiceName: string): Promise<Result<void>> {
        return this.authenticateMarketVisitorAsync(admin, async (id: string) => {
            if (!this.uController.checkPermission(id, -1, Permissions.AdminControl)) {
                return new Result(false, undefined, "no admin Privileges");
            }
            if (type === ExternalServiceType.Delivery)
                this.pController.swapDeliveryService(new DeliveryServiceAdaptor(newServiceName, new DeliveryService(newServiceName)));
            else
                this.pController.swapPaymentService(new PaymentServiceAdaptor(newServiceName, new PaymentService(newServiceName)))

            return new Result(true, undefined, "services swapped");


        })

    }


    async getMessages(sessionId: string) {
        return this.authenticateMarketVisitorAsync(sessionId, async (id) => {
            return await this.mController.getMessages(id);
        })
    }

    /*-----------------------------------Offer (bid on product)----------------------------------------------*/
    async addOffer2Shop(sessionId, shopId: number, pId: number, price: number): Promise<Result<void>> {
        return this.authenticateMarketVisitorAsync(sessionId, async (username) => {
            let offer: Result<void | Offer> = await this.mpController.addOffer2Product(shopId, username, pId, price);
            if (checkRes(offer)) {
                return this.scController.addOffer2cart(username, offer.data);
            }
        })
    }

    async approveOffer(sessionId: string, shopId: number, offerId: number, answer: boolean): Promise<Result<void>> {
        return this.authenticateMarketVisitorAsync(sessionId, async (username) => {
            return this.mpController.approveOffer(shopId, offerId, username, answer);
        });
    }

    async filingCounterOffer(sessionId: string, shopId: number, offerId: number, counterPrice: number): Promise<Result<void>> {
        return this.authenticateMarketVisitorAsync(sessionId, async (username) => {
            let result: Result<void | Offer> = await this.mpController.filingCounterOffer(shopId, offerId, username, counterPrice);
            if (checkRes(result)) {
                this.scController.updateOfferFromCart(result.data);
                return Result.Ok(result.data);
            }
            return Result.Fail(result.message);
        })
    }

    async denyCounterOffer(sessionId: string, username: string, shopId: number, offerId: number): Promise<Result<void>> {
        return this.authenticateMarketVisitorAsync(sessionId, async () => {
            this.scController.removeOffer(username, offerId);
            return this.mpController.denyCounterOffer(shopId, offerId);
        })
    }

    async acceptCounterOffer(sessionId: string, shopId: number, offerId: number): Promise<Result<void>> {
        return this.authenticateMarketVisitorAsync(sessionId, async (username) => {
            let result: Result<void | Offer> = await this.mpController.acceptCounterOffer(shopId, offerId);
            if (checkRes(result)) {
                this.scController.updateOfferFromCart(result.data);
                return Result.Ok(result.data);
            }
            return Result.Fail(result.message);
        })
    }

    /*-----------------------------------Appointment agreement----------------------------------------------*/
    async submitOwnerAppointmentInShop(sessionId: string, shopId: number, member: string, assigner: string): Promise<Result<void>> {
        return this.authenticateMarketVisitor(sessionId, () => {
            return this.mpController.submitOwnerAppointmentInShop(shopId, member, assigner);
        })
    }


}
