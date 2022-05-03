import {SystemController} from "../domain/controller/SystemController";
import {Result} from "../utilities/Result";
import {ExternalServiceType} from "../utilities/Utils";


export class OrderService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //System - Use-Case 2.2
    swapConnectionWithExternalService(adminUsername: string, type: ExternalServiceType, serviceName: string): Result<void> {
        return this.systemController.swapConnectionWithExternalService(adminUsername, type, serviceName);
    }

    //System - Use-Case 2.1
    editConnectionWithExternalService(adminUsername: string, type: ExternalServiceType, settings: any): Result<void> {
        return this.systemController.editConnectionWithExternalService(adminUsername, type, settings);
    }
}
