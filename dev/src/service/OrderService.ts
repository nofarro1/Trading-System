import {SystemController} from "../domain/SystemController";
import {Result} from "../utilities/Result";
import {ExternalServiceType} from "../utilities/Utils";


export class OrderService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //System - Use-Case 2.2
    swapConnectionWithExternalService(sessionID: string, adminUsername: string, type: ExternalServiceType, serviceName: string): Result<void> {
        return this.systemController.swapConnectionWithExternalService(sessionID, adminUsername, type, serviceName);
    }

    //System - Use-Case 2.1
    editConnectionWithExternalService(sessionID: string, adminUsername: string, type: ExternalServiceType, settings: any): Result<void> {
        return this.systemController.editConnectionWithExternalService(sessionID, adminUsername, type, settings);
    }
}
