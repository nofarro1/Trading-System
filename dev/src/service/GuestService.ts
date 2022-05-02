import {SystemController} from "../domain/controller/SystemController";
import {Result} from "../utilities/Result";


export class GuestService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 3
    register(guestID: number, username: string, password: string, firstName?: string, lastName?: string,
             email?: string, country?: string): Result<void> {
        return this.systemController.registerMember(guestID, {username: username, password: password,
            firstName: firstName, lastName: lastName, email: email, country: country});
    }

    //General Admin - Use-Case 0
    registerAdmin(guestID: number, username: string, password: string, firstName?: string, lastName?: string,
                  email?: string, country?: string): Result<void> {
        return this.systemController.registerAsAdmin(guestID, {username: username, password: password,
            firstName: firstName, lastName: lastName, email: email, country: country});
    }

    //General Guest - Use-Case 4
    login(guestID: number, username: string, password: string): Result<void> {
        return this.systemController.login(guestID, { username: username, password: password });
    }
}
