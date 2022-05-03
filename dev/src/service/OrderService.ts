import {SystemController} from "../domain/controller/SystemController";
import {Result} from "../utilities/Result";
import {ExternalServiceType} from "../utilities/Utils";


export class OrderService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //System - Use-Case 2.2
    swapConnectionWithExternalService(type: ExternalServiceType, serviceName: string): Result<void> {
        return this.systemController.swapConnectionWithExternalService(type, serviceName);
    }

    //System - Use-Case 2.1
    editConnectionWithExternalService(type: ExternalServiceType, settings: any): Result<void> {
        return this.systemController.editConnectionWithExternalService(type, settings);
    }
}
