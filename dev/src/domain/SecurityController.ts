import {logger} from "../helpers/logger";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class SecurityController {
    private readonly _MINIMUM_PASSWORD_LENGTH = 6;
    private readonly _MAXIMUM_USERNAME_LENGTH = 31;

      _members: Map<string, string>; //Username <-> Password
      _activeGuests: Set<string>; //Session IDs
      _loggedInMembers: Map<string, string>; //Session ID <-> Username

    constructor() {
        this._members = new Map<string, string>();
        this._activeGuests = new Set<string>();
        this._loggedInMembers = new Map<string, string>();
    }

    get MINIMUM_PASSWORD_LENGTH(): number {
        return this._MINIMUM_PASSWORD_LENGTH;
    }

    get MAXIMUM_USERNAME_LENGTH(): number {
        return this._MAXIMUM_USERNAME_LENGTH;
    }

    get activeGuests(): Set<string> {
        return this._activeGuests;
    }

    get members(): Map<string, string> {
        return this._members;
    }

    get loggedInMembers(): Map<string, string> {
        return this._loggedInMembers;
    }

    checkPassword(username: string, password: string): boolean {
        return this.members.get(username) === password
    }

    accessMarketplace(sessionID: string): void {
        if(this.activeGuests.has(sessionID)) {
            logger.error(`[SecurityController/accessMarketplace] There already exists a guest with ${sessionID} in the marketplace`);
            throw new Error(`There already exists a guest with ${sessionID} in the marketplace`);
        }
        this.activeGuests.add(sessionID);
        logger.info(`[SecurityController/accessMarketplace] ${sessionID} has accessed the marketplace successfully and added to thr activeGuests`);
    }

    exitMarketplace(sessionID: string): void {
        if (!this.activeGuests.has(sessionID)) {
            logger.error(`[SecurityController/accessMarketplace] There is no guest with ${sessionID} currently in the marketplace`);
            throw new Error(`There is no guest with ${sessionID} currently in the marketplace`);
        }

        logger.info(`[SecurityController/accessMarketplace] Guest: ${sessionID} has successfully exited the marketplace`);
        this.activeGuests.delete(sessionID);
    }

    register(sessionID: string, username: string, password: string): void {
        if(!this.activeGuests.has(sessionID)) {
            logger.error(`[SecurityController/register] There is no active session with ID ${sessionID}`);
            throw new Error(`There is no active session with ID ${sessionID}`);
        }
        if(username.length > this.MAXIMUM_USERNAME_LENGTH || username.length === 0) {
            logger.warn(`[SecurityController/register] Username '${username}' cannot be empty or longer than 31 characters`);
            throw new Error(`Username '${username}' cannot be empty or longer than 31 characters`);
        }
        if(this.members.has(username)) {
            logger.warn(`[SecurityController/register] A member with the username ${username} already exists`);
            throw new Error(`A member with the username ${username} already exists`);
        }
        if(password.length < this.MINIMUM_PASSWORD_LENGTH) {
            logger.warn(`[SecurityController/register] Password is too short and must contain at least ${this.MINIMUM_PASSWORD_LENGTH} characters`);
            throw new RangeError(`Password is too short and must contain at least ${this.MINIMUM_PASSWORD_LENGTH} characters`);
        }

        logger.info(`[SecurityController/register] ${username} has registered successfully to the marketplace`);
        this.members.set(username, password);
    }

    login(sessionID: string, username: string, password: string): void {
        if(!this.activeGuests.has(sessionID)) {
            logger.error(`[SecurityController/login] There is no active session with ID ${sessionID}`);
            throw new Error(`There is no active session with ID ${sessionID}`);
        }
        if(!this.members.has(username)) {
            logger.warn(`[SecurityController/login] A member with the username '${username}' does not exist`);
            throw new Error(`A member with the username '${username}' does not exist`);
        }
        if(this.loggedInMembers.get(sessionID) == username) {
            logger.error(`[SecurityController/login] The member ${username} is already logged into the system`);
            throw new Error(`The member ${username} is already logged into the system`);
        }
        if(this.members.get(username) != password) {
            logger.warn(`[SecurityController/login] The password is invalid, please try again`);
            throw new Error(`The password is invalid, please try again`);
        }

        logger.info(`[SecurityController/login] ${username} has logged in successfully to the system`);
        this.loggedInMembers.set(sessionID, username);
        this.activeGuests.delete(sessionID);
    }

    logout(sessionID: string, username: string): void {
        if(!this.activeGuests.has(sessionID) && !this._loggedInMembers.has(sessionID)) {
            logger.error(`[SecurityController/logout] There is no active session with ID ${sessionID}`);
            throw new Error(`There is no active session with ID ${sessionID}`);
        }
        if(!this.members.has(username)) {
            logger.error(`[SecurityController/logout] A member with the username '${username}' does not exist`);
            throw new Error(`A member with the username '${username}' does not exist`);
        }
        if(this.loggedInMembers.get(sessionID) != username) {
            logger.error(`[SecurityController/logout] ${sessionID}: The member ${username} is not currently logged in`);
            throw new Error(`The member ${username} is not currently logged in`);
        }

        const res = this._loggedInMembers.delete(sessionID);
        logger.info(`[SecurityController/logout] Member ${username} has logged out successfully`);
    }

    hasActiveSession(sessionID: string): string {
        logger.info(`[SecurityController/hasActiveSession] Checking whether ${sessionID} is associated with a logged in member or active guest`);
        logger.warn(`[SecurityController/hasActiveSession] start`);
        if(this.activeGuests.has(sessionID)){
            logger.warn(`[SecurityController/hasActiveSession] in first if`);
            return sessionID;
        }
        if(this.loggedInMembers.has(sessionID)) {
            // @ts-ignore
            logger.warn(`[SecurityController/hasActiveSession] in second if`);
            return this.loggedInMembers.get(sessionID);
        }
        logger.warn(`[SecurityController/hasActiveSession]  exit`);
        return "";
    }
}