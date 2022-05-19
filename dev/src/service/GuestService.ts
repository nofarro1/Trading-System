import {SystemController} from "../domain/SystemController";
import {Result} from "../utilities/Result";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";


export class GuestService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 3
    register(sessionID: string, username: string, password: string, firstName?: string, lastName?: string,
             email?: string, country?: string): Result<void> {
        return this.systemController.registerMember(sessionID, {username: username, password: password,
            firstName: firstName, lastName: lastName, email: email, country: country});
    }

    //General Admin - Use-Case 0
    registerAdmin(username: string, password: string, firstName?: string, lastName?: string,
                  email?: string, country?: string): Result<void> {
        return this.systemController.registerAsAdmin({username: username, password: password,
            firstName: firstName, lastName: lastName, email: email, country: country});
    }

    //General Guest - Use-Case 4
    login(sessionID: string, username: string, password: string): Result<void | SimpleMember> {
        return this.systemController.login(sessionID, { username: username, password: password });
    }
}
