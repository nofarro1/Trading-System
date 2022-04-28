import {Guest} from "../user/Guest";
import {SecurityController} from "./SecurityController";
import {loginData, newRoleData, newShopData, registerMemberData} from "../dataObjs";
import {Member} from "../user/Member";
import {Id} from "../Utils";
import {Role} from "../user/Role";


class SystemController {

    mpController: MarketplaceController
    scController: ShoppingCartController
    gController: GuestController
    mController: MemberController
    pController: PurchaseController
    nController: NotificationController
    securityController: SecurityController


    constructor(mpController: MarketplaceController, scController: ShoppingCartController, gController: GuestController, mController: MemberController, pController: PurchaseController, nController: NotificationController, sController: SecurityController) {
        this.mpController = mpController;
        this.scController = scController;
        this.gController = gController;
        this.mController = mController;
        this.pController = pController;
        this.nController = nController;
        this.securityController = sController;
    }

    static initialize():SystemController {


        //create all services
        let marketplace = new MarketplaceController();
        let shoppingCart = new ShoppingCartController();
        let guest = new GuestController();
        let member = new MemberController();
        let purchase = new PurchaseController();
        let notification = new NotificationController();
        let security = new SecurityController();

        //todo: configure dependencies between controllers

        return new SystemController(marketplace, shoppingCart, guest,member,purchase, notification,security);

    }

    connectGuest(/*a way to distinguish users connection*/): Result<Guest> {
        let newGuest:Guest = this.gController.addNewGuest();


        this.securityController.addActiveGuest(newGuest);

        return new Result(true,newGuest);
    }

    login(d: loginData): Result<Member> {

        //dispatch to security controller

        //if success get the memberid

        //retrieve member and add it to active users

        //initiate live notification connection with user

        //save member id with notification connection in map.


        return new Result(true, null)
    }

    logout(memberId): Result<Guest> {

        // dispatch to security controller

        // get conformation of log out

        // remove member and live notification

        //update guestController

        return this.connectGuest();
    }

    registerMember(NewMember: registerMemberData): Result<void> {
        return null
    }

    becomeShopFounder(shopData: newShopData): Result<Shop> {
        return null;
    }

    assignShopManager(newRole: newRoleData, assigner:Id): Result<Role> {

        return null;
    }

    addShopOwner(newRole: newRoleData, assigner:Id): Result<Role> {
        return null
    }

    removeShopManager(toRemove: Member, remover:Member, shop:Shop): Result<void> {
        return null
    }

    removeShopOwner(toRemove: Member, remover:Member, shop:Shop): Result<void> {
        return null
    }

    addShopManagerPermissions(manager: Member, owner: Member, ...permissions:Permission[]): Result<Role> {

        return null
    }

    removeShopManagerPermissions(manager: Member, owner: Member, ...permissions:Permission[]): Result<Role> {

        return null
    }




}