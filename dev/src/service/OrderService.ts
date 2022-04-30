import {SystemController} from "../domain/controller/SystemController";
import {Result} from "../utilities/Result";
import {ExternalServiceType} from "../utilities/Utils";


export class OrderService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //System - Use-Case 2
    addConnectionWithExternalService(type: ExternalServiceType, serviceName: string): Result<void> {
        return this.systemController.addConnectionWithExternalService(type, serviceName);
    }

    //System - Use-Case 2.1
    editConnectionWithExternalService(type: ExternalServiceType, serviceName: string, settings?: any): Result<void> {
        return this.systemController.editConnectionWithExternalService(type, serviceName, settings);
    }

    //System - Use-Case 2.2
    swapConnectionWithExternalService(type: ExternalServiceType, newServiceName: string): Result<void> {
        return this.systemController.swapConnectionWithExternalService(type, newServiceName);
    }

    //System - Use-Case 3
    //System - Use-Case 4
    callService(type: ExternalServiceType, serviceDetails?: any): Result<void> {
        return this.systemController.callService(type, serviceDetails);
    }
}
