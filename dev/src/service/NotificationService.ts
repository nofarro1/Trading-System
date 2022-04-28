import {SystemController} from "../domain/controller/SystemController";


class NotificationService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }
}