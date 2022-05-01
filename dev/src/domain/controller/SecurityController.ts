import {User} from "../user/User";
import {Member} from "../user/Member";

export class SecurityController {
    private readonly MINIMUM_PASSWORD_LENGTH = 8;

    private users: Map<string, string>;
    private activeGuests: User[];
    private loggedInMembers: Member[];

    constructor() {
        this.users = new Map<string, string>();
        this.activeGuests = new Array<User>();
        this.loggedInMembers = new Array<Member>();
    }

    accessMarketplace(guestID: string) {

    }

    exitMarketplace(guestID: string) {

    }

    register(username: string, password: string): void {
        if(this.users.has(username))
            throw new Error(`A member with the username ${username} already exists`);
        if(password.length < this.MINIMUM_PASSWORD_LENGTH)
            throw new RangeError(`Password is too short and must contain at least ${this.MINIMUM_PASSWORD_LENGTH} characters`);

        this.users.set(username, password);
    }

    login(username: string, password: string) {

    }

    logout(username: string) {

    }

    isLoggedIn(userID: string) {

    }
}