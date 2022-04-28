import {SystemController} from "../domain/controller/SystemController";


class OrderService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }
}