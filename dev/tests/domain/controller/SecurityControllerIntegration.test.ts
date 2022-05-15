import {SecurityController} from "../../../src/domain/SecurityController";

let controller: SecurityController;
let guestID: number = 1;
let username: string = "username";
let password: string = "123456789";
let shortPassword: string = "123";

describe('SecurityController - tests', function () {

    beforeEach(function () {
        controller = new SecurityController();
    })

    test("Access Marketplace - invalid Guest ID", () => {
        controller.accessMarketplace(guestID);
        expect(controller.activeGuests).toContain(guestID);
        expect(function() { controller.accessMarketplace(guestID) }).toThrow(new Error(`There already exists a guest with ${guestID} in the marketplace`));
    })

    test("Register - username already exists", () => {
        controller.register(username, password);
        expect(controller.users.get(username)).toBeDefined()
        expect(function() { controller.register(username, password) }).toThrow(new Error(`A member with the username ${username} already exists`));
    })

    test("Login - valid input", () => {
        //valid register
        controller.register(username, password);
        expect(controller.users.get(username)).toBeDefined()

        controller.login(username, password);
        expect(controller.loggedInMembers).toContain(username);
    })

    test("Login - member already logged in", () => {
        //valid register
        controller.register(username, password);
        expect(controller.users.get(username)).toBeDefined()

        //valid login
        controller.login(username, password);
        expect(controller.loggedInMembers).toContain(username);

        expect(function() { controller.login(username, password) }).toThrow(new Error(`The member ${username} is already logged into the system`));
    })

    test("Login - invalid password", () => {
        //valid register
        controller.register(username, password);
        expect(controller.users.get(username)).toBeDefined();

        expect(function() { controller.login(username, shortPassword) }).toThrow(new Error(`The password is invalid, please try again`));
    })

    test("Logout - valid input", () => {
        //valid register
        controller.register(username, password);
        expect(controller.users.get(username)).toBeDefined();

        //valid login
        controller.login(username, password);
        expect(controller.loggedInMembers).toContain(username);

        controller.logout(username);
        expect(controller.loggedInMembers).not.toContain(username);
    })

    test("Logout - member is not logged in", () => {
        //valid register
        controller.register(username, password);
        expect(controller.users.get(username)).toBeDefined();

        expect(function() { controller.logout(username) }).toThrow(new Error(`The member ${username} is not currently logged in`));
    })

    test("Exit Marketplace - valid Guest ID", () => {
        //valid access marketplace
        controller.accessMarketplace(guestID);
        expect(controller.activeGuests).toContain(guestID);

        controller.exitMarketplace(guestID);
        expect(controller.activeGuests).not.toContain(guestID);
    })
});