import {logger} from "../helpers/logger";
import {injectable} from "inversify";
import {BaseEntity, Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class MemberCredentials extends BaseEntity{
    @PrimaryColumn({type: "text"})
    username: string;
    @Column({type: "text"})
    password: string;

    constructor(username: string, password: string) {
        super();
        this.username = username;
        this.password = password;
    }
}

@injectable()
export class SecurityController {
    private readonly _MINIMUM_PASSWORD_LENGTH = 8;
    private readonly _MAXIMUM_USERNAME_LENGTH = 31;
    private readonly _members: Map<string, string>; //Username <-> Password
    private readonly _memberCredentials: MemberCredentials[]; //For ORM dependency
    private readonly _activeSessions: Set<string>; //Session IDs
    private readonly _loggedInMembers: Map<string, string>; //Session ID <-> Username

    constructor() {
        this._members = new Map<string, string>();
        this._activeSessions = new Set<string>();
        this._loggedInMembers = new Map<string, string>();
        this._memberCredentials = new Array<MemberCredentials>();
    }

    get MINIMUM_PASSWORD_LENGTH(): number {
        return this._MINIMUM_PASSWORD_LENGTH;
    }

    get MAXIMUM_USERNAME_LENGTH(): number {
        return this._MAXIMUM_USERNAME_LENGTH;
    }

    get memberCredentials(): MemberCredentials[] {
        return this._memberCredentials;
    }

    get activeSessions(): Set<string> {
        return this._activeSessions;
    }

    get members(): Map<string, string> {
        return this._members;
    }

    get loggedInMembers(): Map<string, string> {
        return this._loggedInMembers;
    }

    accessMarketplace(sessionID: string): void {
        if (this.activeSessions.has(sessionID)) {
            logger.error(`There already exists a guest with ${sessionID} in the marketplace`);
            throw new Error(`There already exists a guest with ${sessionID} in the marketplace`);
        }

        logger.info(`${sessionID} has accessed the marketplace successfully`);
        this.activeSessions.add(sessionID);
    }

    exitMarketplace(sessionID: string): void {
        if (!this.activeSessions.has(sessionID)) {
            logger.error(`There is no guest with ${sessionID} currently in the marketplace`);
            throw new Error(`There is no guest with ${sessionID} currently in the marketplace`);
        }

        logger.info(`Guest: ${sessionID} has successfully exited the marketplace`);
        this.activeSessions.delete(sessionID);
    }

    register(sessionID: string, username: string, password: string): void {
        if (!this.activeSessions.has(sessionID)) {
            logger.error(`There is no active session with ID ${sessionID}`);
            throw new Error(`There is no active session with ID ${sessionID}`);
        }
        if (username.length > this.MAXIMUM_USERNAME_LENGTH || username.length === 0) {
            logger.warn(`Username '${username}' cannot be empty or longer than 31 characters`);
            throw new Error(`Username '${username}' cannot be empty or longer than 31 characters`);
        }
        if (this.members.has(username)) {
            logger.warn(`A member with the username ${username} already exists`);
            throw new Error(`A member with the username ${username} already exists`);
        }
        if (password.length < this.MINIMUM_PASSWORD_LENGTH) {
            logger.warn(`Password is too short and must contain at least ${this.MINIMUM_PASSWORD_LENGTH} characters`);
            throw new RangeError(`Password is too short and must contain at least ${this.MINIMUM_PASSWORD_LENGTH} characters`);
        }

        logger.info(`${username} has registered successfully to the marketplace`);
        this.members.set(username, password);
        let newMember: MemberCredentials = new MemberCredentials(username, password);
        this.memberCredentials.push(newMember);
        newMember.save();
    }

    login(sessionID: string, username: string, password: string): void {
        if (!this.activeSessions.has(sessionID)) {
            logger.error(`There is no active session with ID ${sessionID}`);
            throw new Error(`There is no active session with ID ${sessionID}`);
        }
        if (this.loggedInMembers.get(sessionID) == username) {
            logger.error(`The member ${username} is already logged into the system`);
            throw new Error(`The member ${username} is already logged into the system`);
        }
        if (!this.members.has(username)) {
            logger.warn(`A member with the username '${username}' does not exist`);
            throw new Error(`A member with the username '${username}' does not exist`);
        }
        if (this.members.get(username) != password) {
            logger.warn(`The password is invalid, please try again`);
            throw new Error(`The password is invalid, please try again`);
        }

        logger.info(`${username} has logged in successfully to the system`);
        this.loggedInMembers.set(sessionID, username);
    }

    logout(sessionID: string, username: string): void {
        if (!this.activeSessions.has(sessionID)) {
            logger.error(`There is no active session with ID ${sessionID}`);
            throw new Error(`There is no active session with ID ${sessionID}`);
        }
        if (!this.members.has(username)) {
            logger.error(`A member with the username '${username}' does not exist`);
            throw new Error(`A member with the username '${username}' does not exist`);
        }
        if (this.loggedInMembers.get(sessionID) != username) {
            logger.error(`${sessionID}: The member ${username} is not currently logged in`);
            throw new Error(`The member ${username} is not currently logged in`);
        }

        logger.info(`Member ${username} has logged out successfully`);
        this.loggedInMembers.delete(username);
        this.activeSessions.add(sessionID);
    }

    hasActiveSession(sessionID: string): string {
        logger.info(`Checking whether ${sessionID} is associated with a logged in member or active guest`);
        if (this.activeSessions.has(sessionID))
            return sessionID;
        if (this.loggedInMembers.has(sessionID)) {
            return this.loggedInMembers?.get(sessionID);
        }
        return "";
    }
}