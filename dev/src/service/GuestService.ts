import {SystemController} from "../domain/controller/SystemController";
import {Permission} from "../utilities/Permission";
import {Result} from "../utilities/Result";


class GuestService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 3
    register(username: string, password: string): Result<boolean> {
        return new Result<boolean>(true, null, "Success");
    }

    login(username: string, password: string): Result<boolean> {
        return new Result<boolean>(true, null, "Login successful");
    }




}