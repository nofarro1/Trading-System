import {UserID} from "./utilities/Utils";
import {logger} from "./helpers/logger";

export class SecurityController {
    private readonly _MINIMUM_PASSWORD_LENGTH = 8;

    private readonly _users: Map<string, string>;
    private readonly _activeGuests: Set<number>;
    private readonly _loggedInMembers: Set<string>;

    constructor() {
        this._users = new Map<string, string>();
        this._activeGuests = new Set<number>();
        this._loggedInMembers = new Set<string>();
    }

    get MINIMUM_PASSWORD_LENGTH(): number {
        return this._MINIMUM_PASSWORD_LENGTH;
    }

    get activeGuests(): Set<number> {
        return this._activeGuests;
    }

    get users(): Map<string, string> {
        return this._users;
    }

    get loggedInMembers(): Set<string> {
        return this._loggedInMembers;
    }

    accessMarketplace(guestID: number): void {
        if(this._activeGuests.has(guestID)) {
            logger.error(`There already exists a guest with ${guestID} in the marketplace`);
            throw new Error(`There already exists a guest with ${guestID} in the marketplace`);
        }
        logger.info(`${guestID} has accessed the marketplace successfully`);
        this._activeGuests.add(guestID);
    }

    exitMarketplace(userID: UserID): void {
        if(typeof userID === "string")
            this.logout(userID);
        else {
            if (!this._activeGuests.has(userID)) {
                logger.error(`There is no guest with ${userID} currently in the marketplace`);
                throw new Error(`There is no guest with ${userID} currently in the marketplace`);
            }

            logger.info(`Guest: ${userID} has successfully exited the marketplace`);
            this._activeGuests.delete(userID);
        }
    }

    register(username: string, password: string): void {
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

    login(username: string, password: string): void {
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
        this._loggedInMembers.add(username);
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

    isLoggedIn(userID: UserID): boolean {
        logger.info(`Checking whether ${userID} is a logged in member or active guest`);
        if(typeof userID === "string")
            return this._loggedInMembers.has(userID);
        else
            return this._activeGuests.has(userID);
    }
}