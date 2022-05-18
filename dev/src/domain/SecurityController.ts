import {UserID} from "../utilities/Utils";
import {logger} from "../helpers/logger";

export class SecurityController {
    private readonly _MINIMUM_PASSWORD_LENGTH = 8;
    private readonly _MAXIMUM_USERNAME_LENGTH = 31;

    private readonly _users: Map<string, string>;
    private readonly _activeGuests: Set<string>;
    private readonly _loggedInMembers: Map<string,string>;

    constructor() {
        this._users = new Map<string, string>();
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

    get users(): Map<string, string> {
        return this._users;
    }

    get loggedInMembers(): Map<string, string> {
        return this._loggedInMembers;
    }

    accessMarketplace(sessionId: string): void {
        if(this._activeGuests.has(sessionId)) {
            logger.error(`There already exists a guest with ${sessionId} in the marketplace`);
            throw new Error(`There already exists a guest with ${sessionId} in the marketplace`);
        }
        logger.info(`${sessionId} has accessed the marketplace successfully`);
        this._activeGuests.add(sessionId);
    }

    exitMarketplace(sessionID: string): void {
        if(typeof sessionID === "string")
            this.logout(sessionID);
        else {
            if (!this._activeGuests.has(sessionID)) {
                logger.error(`There is no guest with ${sessionID} currently in the marketplace`);
                throw new Error(`There is no guest with ${sessionID} currently in the marketplace`);
            }

            logger.info(`Guest: ${sessionID} has successfully exited the marketplace`);
            this._activeGuests.delete(sessionID);
        }
    }

    register(sessionId:string,username: string, password: string): void {
        if(username.length > 31 || username.length === 0) {
            logger.warn(`Username '${username}' cannot be empty or longer than 31 characters`);
            throw new Error(`Username '${username}' cannot be empty or longer than 31 characters`);
        }
        if(this._users.has(username)) {
            logger.warn(`A member with the username ${username} already exists`);
            throw new Error(`A member with the username ${username} already exists`);
        }
        if(password.length < this._MINIMUM_PASSWORD_LENGTH) {
            logger.warn(`Password is too short and must contain at least ${this._MINIMUM_PASSWORD_LENGTH} characters`);
            throw new RangeError(`Password is too short and must contain at least ${this._MINIMUM_PASSWORD_LENGTH} characters`);
        }

        logger.info(`${username} has registered successfully to the marketplace`);
        this._users.set(username, password);
    }

    login(sessionId:string ,username: string, password: string): void {
        if(!this._users.has(username)) {
            logger.warn(`A member with the username '${username}' does not exist`);
            throw new Error(`A member with the username '${username}' does not exist`);
        }
        if(this._loggedInMembers.has(username)) {
            logger.error(`The member ${username} is already logged into the system`);
            throw new Error(`The member ${username} is already logged into the system`)
        }
        if(this._users.get(username) != password) {
            logger.warn(`The password is invalid, please try again`);
            throw new Error(`The password is invalid, please try again`);
        }

        logger.info(`${username} has logged in successfully to the system`);
        this._loggedInMembers.set(sessionId,username);
    }

    logout(username: string): void {
        if(!this._users.has(username)) {
            logger.error(`A member with the username '${username}' does not exist`);
            throw new Error(`A member with the username '${username}' does not exist`);
        }
        if(!this._loggedInMembers.has(username)) {
            logger.error(`The member ${username} is not currently logged in`);
            throw new Error(`The member ${username} is not currently logged in`);
        }

        logger.info(`Member ${username} has logged out successfully`);
        this._loggedInMembers.delete(username);
    }

    isLoggedIn(userID: string): boolean {
        logger.info(`Checking whether ${userID} is a logged in member or active guest`);
        if(typeof userID === "string")
            return this._loggedInMembers.has(userID);
        else
            return this._activeGuests.has(userID);
    }
}