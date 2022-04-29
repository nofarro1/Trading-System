import {SystemController} from "../domain/controller/SystemController";


export class NotificationService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }
}