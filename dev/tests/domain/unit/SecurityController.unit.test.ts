import {SecurityController} from "../../../src/domain/SecurityController";
import bcrypt from "bcrypt";

let controller: SecurityController;
const sessionID: string = "some-sessionID-with-the-following-string";
const username: string = "username";
const longUsername: string = "abcdefghijklmnopqrstuvwxyzABCDEF";
const emptyUsername: string = "";
const password: string = "123456789";
const shortPassword: string = "123";

describe('SecurityController - tests', function () {

    beforeEach(function () {
        controller = new SecurityController();
    })

    test("Access Marketplace - valid Guest ID", () => {
        controller.accessMarketplace(sessionID);
        expect(controller.activeGuests).toContain(sessionID);
    })

   test("Access Marketplace - invalid Guest ID", () => {
       controller.activeGuests.add(sessionID);

       expect(function() { controller.accessMarketplace(sessionID) }).toThrow(new Error(`There already exists a guest with ${sessionID} in the marketplace`));
   })

    test("Register - valid input", async () => {
        controller.activeGuests.add(sessionID);

        await controller.register(sessionID, username, password);
        expect(await bcrypt.compare(password, controller.members.get(username))).toBe(true);
    })

    test("Register - invalid session ID", () => {
        expect(async function () {
            await controller.register(sessionID, username, password)
        }).rejects.toThrow(new Error(`There is no active session with ID ${sessionID}`));
    })

    test("Register - username already exists", () => {
        controller.activeGuests.add(sessionID);
        controller.members.set(username, password);

        expect(async function () {
            await controller.register(sessionID, username, password)
        }).rejects.toThrow(new Error(`A member with the username ${username} already exists`));
    })

    test("Register - invalid password", () => {
        controller.activeGuests.add(sessionID);

        expect(async function () {
            await controller.register(sessionID, username, shortPassword)
        }).rejects.toThrow(new RangeError(`Password is too short and must contain at least ${controller.MINIMUM_PASSWORD_LENGTH} characters`));
    })

    test("Register - long username", () => {
        controller.activeGuests.add(sessionID);

        expect(async function () {
            await controller.register(sessionID, longUsername, password)
        }).rejects.toThrow(new Error(`Username '${longUsername}' cannot be empty or longer than 31 characters`));
    })

    test("Register - empty username", () => {
        controller.activeGuests.add(sessionID);

        expect(async function () {
            await controller.register(sessionID, emptyUsername, password)
        }).rejects.toThrow(new Error(`Username '${emptyUsername}' cannot be empty or longer than 31 characters`));
    })

    test("Login - valid input", async () => {
        //valid access marketplace
        controller.activeGuests.add(sessionID);
        //valid register
        controller.members.set(username, password);

        await controller.login(sessionID, username, password);
        expect(controller.loggedInMembers.get(sessionID)).toBe(username);
        expect(controller.activeGuests).not.toContain(sessionID);
    })

    test("Login - invalid session ID", () => {
        expect(async function () {
            await controller.login(sessionID, username, password)
        }).rejects.toThrow(new Error(`There is no active session with ID ${sessionID}`));
    })

    test("Login - username does not exist", () => {
        //valid access marketplace
        controller.activeGuests.add(sessionID);

        expect(async function () {
            await controller.login(sessionID, username, password)
        }).rejects.toThrow(new Error(`A member with the username '${username}' does not exist`));
    })

    test("Login - member already logged in", async () => {
        //valid access marketplace
        controller.activeGuests.add(sessionID);
        //valid register
        controller.members.set(username, await bcrypt.hash(password, 10));

        //valid login
        controller.loggedInMembers.set(sessionID, username);

        expect(async function () {
            await controller.login(sessionID, username, password)
        }).rejects.toThrow(new Error(`The member ${username} is already logged into the system`));
    })

    test("Login - invalid password", () => {
        //valid access marketplace
        controller.activeGuests.add(sessionID);
        //valid register
        controller.members.set(username, password);

        expect(async function () {
            await controller.login(sessionID, username, shortPassword)
        }).rejects.toThrow(new Error(`The password is invalid, please try again`));
    })

    test("Logout - valid input", () => {
        //valid access marketplace
        controller.activeGuests.add(sessionID);
        //valid register
        controller.members.set(username, password);

        //valid login
        controller.loggedInMembers.set(sessionID, username);

        controller.logout(sessionID, username);
        expect(controller.loggedInMembers).not.toContain(username);
        expect(controller.activeGuests).toContain(sessionID);
    })

    test("Logout - invalid session ID", () => {
        expect(function() { controller.logout(sessionID, username) }).toThrow(new Error(`There is no active session with ID ${sessionID}`));
    })

    test("Logout - username does not exist", () => {
        //valid access marketplace
        controller.activeGuests.add(sessionID);

        expect(function() { controller.logout(sessionID, username) }).toThrow(new Error(`A member with the username '${username}' does not exist`));
    })

    test("Logout - member is not logged in", () => {
        //valid access marketplace
        controller.activeGuests.add(sessionID);
        //valid register
        controller.members.set(username, password);

        expect(function() { controller.logout(sessionID, username) }).toThrow(new Error(`The member ${username} is not currently logged in`));
    })

    test("Exit Marketplace - valid Guest ID", () => {
        //valid access marketplace
        controller.activeGuests.add(sessionID);

        controller.exitMarketplace(sessionID);
        expect(controller.activeGuests).not.toContain(sessionID);
    })

    test("Exit - Invalid Guest ID", () => {
        expect(function() { controller.exitMarketplace(sessionID) }).toThrow(new Error(`There is no guest with ${sessionID} currently in the marketplace`));
    })
});
