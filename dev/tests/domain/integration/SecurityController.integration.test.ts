import {SecurityController} from "../../../src/domain/SecurityController";

let controller: SecurityController;
const sessionID: string = "some-sessionID-with-the-following-string";
const username: string = "username";
const password: string = "123456789";
const shortPassword: string = "123";

describe('SecurityController - tests', function () {

    beforeEach(function () {
        controller = new SecurityController();
    })

    test("Access Marketplace - invalid Guest ID", () => {
        controller.accessMarketplace(sessionID);
        expect(controller.activeSessions).toContain(sessionID);
        expect(function() { controller.accessMarketplace(sessionID) }).toThrow(new Error(`There already exists a guest with ${sessionID} in the marketplace`));
    })

    test("Register - username already exists", () => {
        //valid access marketplace
        controller.accessMarketplace(sessionID);
        expect(controller.activeSessions).toContain(sessionID);

        //valid register
        controller.register(sessionID, username, password);
        expect(controller.members.get(username)).toBeDefined();

        expect(function() { controller.register(sessionID, username, password) }).toThrow(new Error(`A member with the username ${username} already exists`));
    })

    test("Login - valid input", () => {
        //valid access marketplace
        controller.accessMarketplace(sessionID);
        expect(controller.activeSessions).toContain(sessionID);
        //valid register
        controller.register(sessionID, username, password);
        expect(controller.members.get(username)).toBeDefined()

        controller.login(sessionID, username, password);
        expect(controller.loggedInMembers.get(sessionID)).toBe(username);
        expect(controller.activeSessions).not.toContain(sessionID);
    })

    test("Login - member already logged in", () => {
        //valid access marketplace
        controller.accessMarketplace(sessionID);
        expect(controller.activeSessions).toContain(sessionID);
        //valid register
        controller.register(sessionID, username, password);
        expect(controller.members.get(username)).toBeDefined()

        //valid login
        controller.login(sessionID, username, password);
        expect(controller.loggedInMembers).toContain(username);

        expect(function() { controller.login(sessionID, username, password) }).toThrow(new Error(`The member ${username} is already logged into the system`));
    })

    test("Login - invalid password", () => {
        //valid access marketplace
        controller.accessMarketplace(sessionID);
        expect(controller.activeSessions).toContain(sessionID);
        //valid register
        controller.register(sessionID, username, password);
        expect(controller.members.get(username)).toBeDefined();

        expect(function() { controller.login(sessionID, username, shortPassword) }).toThrow(new Error(`The password is invalid, please try again`));
    })

    test("Logout - valid input", () => {
        //valid access marketplace
        controller.accessMarketplace(sessionID);
        expect(controller.activeSessions).toContain(sessionID);
        //valid register
        controller.register(sessionID, username, password);
        expect(controller.members.get(username)).toBeDefined();

        //valid login
        controller.login(sessionID, username, password);
        expect(controller.loggedInMembers).toContain(username);

        controller.logout(sessionID, username);
        expect(controller.loggedInMembers).not.toContain(username);
        expect(controller.activeSessions).toContain(sessionID);
    })

    test("Logout - member is not logged in", () => {
        //valid access marketplace
        controller.accessMarketplace(sessionID);
        expect(controller.activeSessions).toContain(sessionID);
        //valid register
        controller.register(sessionID, username, password);
        expect(controller.members.get(username)).toBeDefined();

        expect(function() { controller.logout(sessionID, username) }).toThrow(new Error(`The member ${username} is not currently logged in`));
    })

    test("Exit Marketplace - valid Guest ID", () => {
        //valid access marketplace
        controller.accessMarketplace(sessionID);
        expect(controller.activeSessions).toContain(sessionID);

        controller.exitMarketplace(sessionID);
        expect(controller.activeSessions).not.toContain(sessionID);
    })
});
