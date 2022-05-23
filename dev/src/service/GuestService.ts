import {SystemController} from "../domain/SystemController";
import {Result} from "../utilities/Result";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";
import {inject, injectable} from "inversify";
import {TYPES} from "../helpers/types";
import "reflect-metadata";

@injectable()
export class GuestService {
    private systemController: SystemController;


    constructor(@inject(TYPES.SystemController)systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 3
    register(sessionID: string, username: string, password: string, firstName?: string, lastName?: string,
             email?: string, country?: string): Promise<Result<void>> {
        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.registerMember(sessionID, {username: username, password: password,
                firstName: firstName, lastName: lastName, email: email, country: country});
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //General Admin - Use-Case 0
    registerAdmin(sessionID: string, username: string, password: string, firstName?: string, lastName?: string,
                  email?: string, country?: string): Promise<Result<void>> {

        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.registerAsAdmin(sessionID, {
                username: username, password: password, firstName: firstName, lastName: lastName, email: email, country: country});
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //General Guest - Use-Case 4
    login(sessionID: string, username: string, password: string): Promise<Result<void | SimpleMember>> {

        return new Promise<Result<void | SimpleMember>>((resolve, reject) => {
            let result: Result<void | SimpleMember> = this.systemController.login(sessionID, { username: username, password: password });
            result.ok ? resolve(result) : reject(result.message);
        });
    }
}
