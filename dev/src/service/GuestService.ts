import {SystemController} from "../domain/SystemController";
import {Result} from "../utilities/Result";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";


export class GuestService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 3
    register(guestID: number, username: string, password: string, firstName?: string, lastName?: string,
             email?: string, country?: string): Promise<Result<void>> {
        let result = this.systemController.registerMember(guestID, {username: username, password: password,
            firstName: firstName, lastName: lastName, email: email, country: country});
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //General Admin - Use-Case 0
    registerAdmin(username: string, password: string, firstName?: string, lastName?: string,
                  email?: string, country?: string): Promise<Result<void>> {
        let result = this.systemController.registerAsAdmin({
            username: username, password: password, firstName: firstName, lastName: lastName, email: email, country: country});
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //General Guest - Use-Case 4
    login(guestID: number, username: string, password: string): Promise<Result<void | SimpleMember>> {
        let result = this.systemController.login(guestID, { username: username, password: password });
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }
}
