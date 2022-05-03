
import {JobType} from "../../../src/utilities/Enums";
import {Permissions} from "../../../src/utilities/Permissions";
import {Member} from "../../../src/domain/user/Member";
import {ShoppingCart} from "../../../src/domain/marketplace/ShoppingCart";
import {Shop} from "../../../src/domain/marketplace/Shop";
import {Role} from "../../../src/domain/user/Role";
import {MessageBox} from "../../../src/domain/notifications/MessageBox";

class TestMember extends Member {

    constructor(member: Member) {
        super(member.username, member.shoppingCart);
    }

}
const m1: Member = new Member("m1", new ShoppingCart());
const test_m1 = new TestMember(m1);
const founder = new Member("founder", new ShoppingCart());

const shop1 = new Shop(12, "myShop", founder.username, undefined);
const shop2 = new Shop(42, "theShop", founder.username, undefined);

let emptyPerm = new Set<Permissions>();
const r1 = new Role(shop1.id, "manager of myShop", JobType.Manager, emptyPerm);
const r2 = new Role(shop2.id, "manager of theShop", JobType.Manager, emptyPerm);
const r3 = new Role(shop2.id, "owner of theShop", JobType.Owner,emptyPerm);
const r4 = new Role(shop1.id, "founder of myShop", JobType.Founder, emptyPerm);



describe('Member - test', function () {

    beforeEach(function () {
        const m = new MessageBox(test_m1.username);
    })


    test("add role to member", () => {
        m1.addRole(r1);
        expect(m1.roles).toContain(r1);
        expect(m1.roles.get(shop1.id)).toBe(r1);
    })

    test("remove role from member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        m1.removeRole(r1.shopId);
        expect(m1.roles).toContain(r2);
        expect(m1.roles).not.toContain(r1);
    })

    test("dont remove role that dont exist from member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        const r3 = new Role(shop1.id, "founder of myShop", JobType.Owner, emptyPerm); 
        m1.removeRole(r3.shopId);
        m1.removeRole(r2.shopId);
        expect(m1.roles).toContain(r3);
        expect(m1.roles).toContain(r2);
        expect(m1.roles).toContain(r1);
    })


    test("add permission to role of member", () => {
        m1.addRole(r1);
        const perm1 = Permissions.RemoveProduct;
        m1.addPermission(r1.shopId, perm1);
        expect(m1.roles.get(r1.shopId)?.permissions).toContain(perm1);
    })

    test("remove permission from role of member", () => {
        m1.addRole(r1);
        const perm1 = Permissions.AddProduct;
        m1.addPermission(r1.shopId, perm1);
        const perm2 = Permissions.RemoveProduct;
        m1.addPermission(r1.shopId, perm2);
        m1.removePermission(r1.shopId, perm1);
        expect(m1.roles.get(r1.shopId)?.permissions).not.toContain(perm1);
        expect(m1.roles.get(r1.shopId)?.permissions).toContain(perm2);
    })

    test("not remove un exist permission of member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        const perm1 = Permissions.AddProduct;
        m1.addPermission(r1.shopId, perm1);
        const perm2 = Permissions.RemoveProduct;
        m1.addPermission(r2.shopId, perm2);
        m1.removePermission(r1.shopId, perm2);
        m1.removePermission(r2.shopId, perm1);
        expect(m1.roles.get(r1.shopId)?.permissions).toContain(perm1);
        expect(m1.roles.get(r2.shopId)?.permissions).toContain(perm2);
    })

    test("get all roles from member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        m1.addRole(r3);
        m1.addRole(r4);
        expect(m1.roles).toContain(r1);
        expect(m1.roles).toContain(r2);
        expect(m1.roles).toContain(r3);
        expect(m1.roles).toContain(r4);
    })
    test("check if role exist member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        m1.addRole(r3);
        m1.addRole(r4);
        expect(m1.hasRole(r3.shopId));
    })

    test("check if role does not exist member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        m1.addRole(r3);
        m1.addRole(r4);
        expect(!m1.hasRole(r2.shopId));
    })
});
