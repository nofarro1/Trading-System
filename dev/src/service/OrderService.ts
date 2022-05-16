import {SystemController} from "../domain/SystemController";
import {Result} from "../utilities/Result";
import {ExternalServiceType} from "../utilities/Utils";


export class OrderService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //System - Use-Case 2.2
    swapConnectionWithExternalService(adminUsername: string, type: ExternalServiceType, serviceName: string): Promise<Result<void>> {
        let result = this.systemController.swapConnectionWithExternalService(adminUsername, type, serviceName);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //System - Use-Case 2.1
    editConnectionWithExternalService(adminUsername: string, type: ExternalServiceType, settings: any): Promise<Result<void>> {
        let result = this.systemController.editConnectionWithExternalService(adminUsername, type, settings);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }
}
