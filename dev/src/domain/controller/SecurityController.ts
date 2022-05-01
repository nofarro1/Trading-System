
export class SecurityController {
    private readonly MINIMUM_PASSWORD_LENGTH = 8;

    private users: Map<string, string>;
    private activeGuests: string[];
    private loggedInMembers: string[];

    constructor() {
        this.users = new Map<string, string>();
        this.activeGuests = new Array<string>();
        this.loggedInMembers = new Array<string>();
    }

    accessMarketplace(guestID: string): void {
        if(this.activeGuests.includes(guestID))
            throw new Error(`There already exists a guest with ${guestID} in the marketplace`);

        this.activeGuests.push(guestID);
    }

    exitMarketplace(guestID: string): void {
        if(!this.activeGuests.includes(guestID))
            throw new Error(`There is no guest with ${guestID} currently in the marketplace`);

        const index = this.activeGuests.indexOf(guestID);
        if (index > -1) {
            this.activeGuests.splice(index, 1);
        }
    }

    register(username: string, password: string): void {
        if(this.users.has(username))
            throw new Error(`A member with the username ${username} already exists`);
        if(password.length < this.MINIMUM_PASSWORD_LENGTH)
            throw new RangeError(`Password is too short and must contain at least ${this.MINIMUM_PASSWORD_LENGTH} characters`);

        this.users.set(username, password);
    }

    login(username: string, password: string): void {
        if(!this.users.has(username))
            throw new Error(`A member with the username '${username}' does not exist`);
        if(this.loggedInMembers.includes(username))
            throw new Error(`The member ${username} is already logged into the system`)
        if(this.users.get(username) != password)
            throw new Error(`The password is invalid, please try again`);

        this.loggedInMembers.push(username);
    }

    logout(username: string): void {
        if(!this.users.has(username))
            throw new Error(`A member with the username '${username}' does not exist`);
        if(!this.loggedInMembers.includes(username))
            throw new Error(`The member ${username} is not currently logged in`);

        const index = this.loggedInMembers.indexOf(username);
        if (index > -1) {
            this.loggedInMembers.splice(index, 1);
        }
    }

    isLoggedIn(userID: string): boolean {
        return !(!this.loggedInMembers.includes(userID) || !this.activeGuests.includes(userID));
    }
}