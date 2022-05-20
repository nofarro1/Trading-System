
import { UserController } from "./UserController";
import {Member} from "../../../src/domain/user/Member";
import { Guest } from "./SimpleGuest";
import { ShoppingCart } from "../integration/marketplace/SimpleShoppingCart";
import { Permissions } from "../../utilities/Permissions";
import { Shop } from "../integration/marketplace/SimpleShop";
import { JobType } from "../../utilities/Enums";

class TestUserController extends UserController {

    constructor() {
        super();
    }
}
const userController = new UserController();

const m1: Member = new Member("member1", new ShoppingCart());
const m2: Member = new Member("member2", new ShoppingCart());

const g1: Guest = new Guest(1, new ShoppingCart());
const g2: Guest = new Guest(2, new ShoppingCart());


describe('UserController tests - test', function () {

    beforeEach(function () {
    })

    test("create guest", () => {
        expect(userController.connectedGuests.size).toBe(0);
        userController.createGuest();
        expect(userController.connectedGuests.size).toBe(1);
    })

    test("get guest", () => {
        let g = userController.createGuest().data;
        if (g)
            expect(userController.connectedGuests).toBe(g);
    })

    test("exit guest", () => {
        let g = userController.createGuest().data;
        userController.createGuest();
        userController.createGuest();
        expect(userController.connectedGuests.size).toBe(3);
        expect(userController.connectedGuests).toContain(g.id);
        userController.exitGuest(g);
        expect(userController.connectedGuests.size).toBe(2);
        expect(userController.connectedGuests).not.toContain(g.id);
    })

    test("add member", () => {
        let m = userController.addMember("member", new ShoppingCart()).data;
        expect(userController.members).toContain(m?.username);
    })

    test("get member"), () => {
        let m = userController.addMember("member", new ShoppingCart()).data;
        if (m)
            expect(userController.getMember(m.username).data).toBe(m);
    }

    test("add permission to member"), () => {
        let p1 = Permissions.ModifyProduct;
        let m = userController.addMember("member", new ShoppingCart()).data;
        if (m){
            let s1 = new Shop(12, "myShop", m1.username);
            let perms = new Set<Permissions>(); 
            let r1 = userController.addRole(m.username, "Manager of myShop", JobType.Manager, s1.id, perms).data;
            if (r1){
                userController.addPermission(m.username, r1.shopId, p1);
                expect(userController.checkPermission(m.username, s1.id, p1).data).toBe(true);
                expect(userController.checkPermission(m.username, s1.id, Permissions.AddProduct).data).toBe(false);
            }
        }
    }

    test("remove permission from member"), () => {
        let p1 = Permissions.ModifyProduct;
        let m = userController.addMember("member", new ShoppingCart()).data;
        if (m){
            let s1 = new Shop(12, "myShop", m1.username);
            let perms = new Set<Permissions>(); 
            let r1 = userController.addRole(m.username, "Manager of myShop", JobType.Manager, s1.id, perms).data;
            if (r1){
                userController.addPermission(m.username, r1.shopId, p1);
                expect(userController.checkPermission(m.username, s1.id, p1).data).toBe(true);
                userController.removePermission(m.username, s1.id, p1);
                expect(userController.checkPermission(m.username, s1.id, p1).data).toBe(false);
            }
        }
    }

    

});
