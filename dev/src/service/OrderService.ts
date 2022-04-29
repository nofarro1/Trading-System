import {SystemController} from "../domain/controller/SystemController";


export class OrderService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }
}