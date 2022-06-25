import {JobType} from "../../../../src/utilities/Enums";
import {Permissions} from "../../../../src/utilities/Permissions";
import {Member} from "../../../../src/domain/user/Member";
import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Role} from "../../../../src/domain/user/Role";

class TestMember extends Member {

    constructor(member: Member) {
        super("1", member.username);
    }

}

const m1: Member = new Member("1", "m1");
const test_m1 = new TestMember(m1);
const founder = new Member("1", "founder");

const shop1 = new Shop(12, "myShop", founder.username);
const shop2 = new Shop(42, "theShop", founder.username);

let emptyPerm = new Set<Permissions>();
const r1 = new Role(shop1.id, JobType.Manager, shop1.shopFounder, emptyPerm);
const r2 = new Role(shop2.id, JobType.Manager, shop2.shopFounder, emptyPerm);
const r3 = new Role(shop2.id, JobType.Owner, shop2.shopFounder,emptyPerm);
const r4 = new Role(shop1.id, JobType.Founder, shop1.shopFounder, emptyPerm);



describe('SimpleMember - test', function () {

    beforeEach(function () {})

    test("add role to member", () => {
        m1.addRole(r1);
        expect(m1.roles).toContain(r1);
        expect(m1.roles.get(shop1.id)).toBe(r1);
    })

    test("remove role from member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        m1.removeRole(r1.shopId, shop1.shopFounder);
        expect(m1.roles).toContain(r2);
        expect(m1.roles).not.toContain(r1);
    })

    test("dont remove role that dont exist from member", () => {
        m1.addRole(r1);
        m1.addRole(r2);
        const r3 = new Role(shop1.id, JobType.Owner, shop1.shopFounder, emptyPerm);
        m1.removeRole(r3.shopId, shop1.shopFounder);
        m1.removeRole(r2.shopId, shop1.shopFounder);
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
