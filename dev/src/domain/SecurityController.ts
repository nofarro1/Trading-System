import {logger} from "../helpers/logger";
import {injectable} from "inversify";
import "reflect-metadata";
import {Entity} from "../utilities/Entity";
import prisma from "../utilities/PrismaClient";

export class MemberCredentials implements Entity{
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        // this.save();
    }

    findById() {
    }

    async save() {
        await prisma.memberCredentials.create({
            data: {
                username: this.username,
                password: this.password,
            },
        });
    }

    update() {
    }

    delete() {

    }
}
import bcrypt from "bcrypt";

@injectable()
export class SecurityController {
    private readonly _MINIMUM_PASSWORD_LENGTH = 6;
    private readonly _MAXIMUM_USERNAME_LENGTH = 31;
    private readonly _members: Map<string, string>; //Username <-> Password
    private readonly _activeSessions: Set<string>; //Session IDs
    private readonly _loggedInMembers: Map<string, string>; //Session ID <-> Username
    private readonly saltRounds = 10;
    constructor() {
        this._members = new Map<string, string>();
        this._activeSessions = new Set<string>();
        this._loggedInMembers = new Map<string, string>();
    }

    get MINIMUM_PASSWORD_LENGTH(): number {
        return this._MINIMUM_PASSWORD_LENGTH;
    }

    get MAXIMUM_USERNAME_LENGTH(): number {
        return this._MAXIMUM_USERNAME_LENGTH;
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

    async checkPassword(username: string, password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.members.get(username));
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

    async register(sessionID: string, username: string, password: string) {
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

        logger.info(`[SecurityController/register] ${username} has registered successfully to the marketplace`);
        const hashed = await bcrypt.hash(password, this.saltRounds);
        this.members.set(username, hashed);

        new MemberCredentials(username, password); //Saves to database
    }

    async login(sessionID: string, username: string, password: string) {
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
        if (!(await this.checkPassword(username, password))) {
            logger.warn(`[SecurityController/login] The password is invalid, please try again`);
            throw new Error(`The password is invalid, please try again`);
        }

        logger.info(`[SecurityController/login] ${username} has logged in successfully to the system`);
        this.loggedInMembers.set(sessionID, username);
        this.activeSessions.delete(sessionID);
    }

    logout(sessionID: string, username: string): void {
        if(!this.activeSessions.has(sessionID) && !this._loggedInMembers.has(sessionID)) {
            logger.error(`[SecurityController/logout] There is no active session with ID ${sessionID}`);
            throw new Error(`There is no active session with ID ${sessionID}`);
        }
        if (!this.members.has(username)) {
            logger.error(`A member with the username '${username}' does not exist`);
            throw new Error(`A member with the username '${username}' does not exist`);
        }
        if(this.loggedInMembers.get(sessionID) !== username) {
            logger.error(`[SecurityController/logout] ${sessionID}: The member ${username} is not currently logged in`);
            throw new Error(`The member ${username} is not currently logged in`);
        }

        const res = this._loggedInMembers.delete(sessionID);
        // this.activeGuests.add(sessionID);
        logger.info(`[SecurityController/logout] Member ${username} has logged out successfully`);
    }

    hasActiveSession(sessionID: string): string {
        logger.info(`Checking whether ${sessionID} is associated with a logged in member or active guest`);
        if (this.activeSessions.has(sessionID))
            return sessionID;
        if (this.loggedInMembers.has(sessionID)) {
            return this.loggedInMembers?.get(sessionID);
        }
        if(this.loggedInMembers.has(sessionID)) {
            // @ts-ignore
            return this.loggedInMembers.get(sessionID) as string;
        }
        return "";
    }
}