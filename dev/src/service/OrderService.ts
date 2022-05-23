import {SystemController} from "../domain/SystemController";
import {Result} from "../utilities/Result";
import {ExternalServiceType} from "../utilities/Utils";
import {inject, injectable} from "inversify";
import {TYPES} from "../helpers/types";
import "reflect-metadata";

@injectable()
export class OrderService {
    private systemController: SystemController;

    constructor(@inject(TYPES.SystemController)systemController: SystemController) {
        this.systemController = systemController;
    }

    //System - Use-Case 2.2
    swapConnectionWithExternalService(sessionID: string, adminUsername: string, type: ExternalServiceType, serviceName: string): Promise<Result<void>> {
        let result: Result<void> = this.systemController.swapConnectionWithExternalService(sessionID, adminUsername, type, serviceName);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //System - Use-Case 2.1
    editConnectionWithExternalService(sessionID: string, adminUsername: string, type: ExternalServiceType, settings: any): Promise<Result<void>> {
        let result: Result<void> = this.systemController.editConnectionWithExternalService(sessionID, adminUsername, type, settings);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }
}
