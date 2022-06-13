import {Member} from "../../../../src/domain/user/Member";
import {Shop} from "../../../../src/domain/marketplace/Shop";
import {Role} from "../../../../src/domain/user/Role";
import {Permissions} from "../../../../src/utilities/Permissions";
import {JobType} from "../../../../src/utilities/Enums";

class TestRole extends Role {

    constructor(role: Role) {
        let perms = new Set<Permissions>();
        super(12, "myShop", JobType.Founder, perms);
    }
}

const founder = new Member("1", "founder");
const shop1 = new Shop(12, "myShop", founder.username);
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