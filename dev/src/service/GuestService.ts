import {SystemController} from "../domain/controller/SystemController";
import {Permissions} from "../utilities/Permissions";
import {Result} from "../utilities/Result";


export class GuestService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 3
    register(guestID: string, username: string, password: string): Result<void> {
        return new Result<void>(true, null, "Success");
    }

    login(guestID: string, username: string, password: string): Result<void> {
        return null;
    }




}