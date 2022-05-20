import { JobType } from "../../utilities/Enums";
import { Permissions } from "../../utilities/Permissions";
import { Shop } from "../../../src/domain/marketplace/Shop";
import { ShoppingCart } from "../../../src/domain/marketplace/ShoppingCart";
import { Member } from "./Member";
import { Role } from "./Role";

class TestRole extends Role {

    constructor(role: Role) {
        let perms = new Set<Permissions>();
        super(12, "myShop", JobType.Founder, perms);
    }
}

const founder = new Member("founder", new ShoppingCart());
const shop1 = new Shop(12, "myShop", founder.username, undefined);
const emptyPerm = new Set<Permissions>();
const r1 = new Role(shop1.id, "manager of myShop", JobType.Manager, emptyPerm);

    describe('Role - test', function () {

        beforeEach(function () {})

        test("add permission to role", () => {
            let p1 = Permissions.ModifyProduct;
            expect(r1.permissions.has(p1)).toBe(false);
            r1.addPermission(p1);
            expect(r1.permissions.has(p1)).toBe(true);
        })

        test("remove permission to role", () => {
            let p1 = Permissions.ModifyProduct;
            r1.addPermission(p1);
            expect(r1.permissions.has(p1)).toBe(true);
            r1.removePermission(p1);
            expect(r1.permissions.has(p1)).toBe(false);
        })

        test("has permission to role", () => {
            let p1 = Permissions.ModifyProduct;
            r1.addPermission(p1);
            expect(r1.permissions.has(p1)).toBe(true);
        })
    });