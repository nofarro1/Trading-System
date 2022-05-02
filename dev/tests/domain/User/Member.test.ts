import { Shop } from "../marketplace/Shop";
import { ShoppingCart } from "../marketplace/ShoppingCart";
import {MessageBox, NewMessageSubscriber} from "../notifications/MessageBox";
import {Member} from "./Member";
import { Permissions } from "./Permissions";
import { JobType, Permission, Role } from "./Role";
import { UserController } from "./UserController";

class TestMember extends Member {

    constructor(member: Member) {
        super(member.getUsername(), member.getShoppingCart(), member.getMessageBox());
    }

}
const m1: Member = new Member("m1", new ShoppingCart(), new MessageBox(" "));
const test_m1 = new TestMember(m1);
const founder = new Member("founder", new ShoppingCart(), new MessageBox(""));

const shop1 = new Shop(12, "myShop", founder.getUsername(), undefined, undefined, undefined);
const shop2 = new Shop(42, "theShop", founder.getUsername(), undefined, undefined, undefined);

const r1 = new Role(shop1.id, "manager of myShop", JobType.Manager, []);
const r2 = new Role(shop2.id, "manager of theShop", JobType.Manager, []);
const r3 = new Role(shop2.id, "owner of theShop", JobType.Owner, []);
const r4 = new Role(shop1.id, "founder of myShop", JobType.Founder, []);



describe('Member - test', function () {

    beforeEach(function () {
        const m = new MessageBox(test_m1.getUsername());
    })


    test("add role to member", () => {
        m1.addRole(r1);
        expect(m1.getRoles()).toContain(r1);
        expect(m1.getRole(shop1.id, JobType.Manager).toBe(r1));
    })

    test("remove role from member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        m1.removeRole(r1.getShopId(), r1.getJobType());
        expect(m1.getRoles()).toContain(r2);
        expect(m1.getRoles()).not.toContain(r1);
    })

    test("dont remove role that dont exist from member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        const r3 = new Role(shop1.id, "founder of myShop", JobType.Owner, []); 
        m1.removeRole(r3.getShopId(), JobType.Founder);
        m1.removeRole(r2.getShopId(), JobType.Owner);
        expect(m1.getRoles()).toContain(r3);
        expect(m1.getRoles()).toContain(r2);
        expect(m1.getRoles()).toContain(r1);
    })


    test("add permission to role of member", () => {
        m1.addRole(r1);
        const perm1 = Permission.Perm;
        m1.addPermission(r1.getShopId(), r1.getJobType(), perm1);
        expect(m1.getRole(r1.getShopId(), r1.getJobType()).getPermitions()).toContain(perm1);
    })

    test("remove permission from role of member", () => {
        m1.addRole(r1);
        const perm1 = Permission.Perm;
        m1.addPermission(r1.getShopId(), r1.getJobType(), perm1);
        const perm2 = Permission.Perm;
        m1.addPermission(r1.getShopId(), r1.getJobType(), perm2);
        m1.removePermission(r1.getShopId(), r1.getJobType(), perm1);
        expect(m1.getRole(r1.getShopId(), r1.getJobType()).getPermitions()).not.toContain(perm1);
        expect(m1.getRole(r1.getShopId(), r1.getJobType()).getPermitions()).toContain(perm2);
    })

    test("not remove un exist permission of member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        const perm1 = Permission.Perm1;
        m1.addPermission(r1.getShopId(), r1.getJobType(), perm1);
        const perm2 = Permission.Perm2;
        m1.addPermission(r2.getShopId(), r2.getJobType(), perm2);
        m1.removePermission(r1.getShopId(), r1.getJobType(), perm2);
        m1.removePermission(r2.getShopId(), r2.getJobType(), perm1);
        expect(m1.getRole(r1.getShopId(), r1.getJobType()).getPermitions()).toContain(perm1);
        expect(m1.getRole(r2.getShopId(), r2.getJobType()).getPermitions()).toContain(perm2);
    })

    test("get all roles from member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        m1.addRole(r3);
        m1.addRole(r4);
        expect(m1.getRoles()).toContain(r1);
        expect(m1.getRoles()).toContain(r2);
        expect(m1.getRoles()).toContain(r3);
        expect(m1.getRoles()).toContain(r4);
    })
    test("check if role exist member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        m1.addRole(r3);
        m1.addRole(r4);
        expect(m1.hasRole(r3.getShopId(), r3.getJobType())).toBe(true);
    })

    test("check if role does not exist member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        m1.addRole(r3);
        m1.addRole(r4);
        expect(m1.hasRole(r2.getShopId(), r4.getJobType())).toBe(false);
    })
});
