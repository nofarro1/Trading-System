import {User} from "../user/User";
import {Member} from "../user/Member";


export class SecurityController {
    private activeGuests: User[];
    private loggedInMembers: Member[];

    constructor() {
        this.activeGuests = new Array<User>();
        this.loggedInMembers = new Array<Member>();
    }

    accessMarketplace(guestID: string) {

    }

    exitMarketplace(guestID: string) {

    }

    register(username: string, password: string) {

    }

    login(username: string, password: string) {

    }

    logout(username: string) {

    }

    isLoggedIn(userID: string) {

    }
}