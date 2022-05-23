import {Permissions} from "../utilities/Permissions";
import {Result} from "../utilities/Result";
import {SystemController} from "../domain/SystemController";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import "reflect-metadata";

@injectable()
export class MemberService {
    private systemController: SystemController;

    constructor(@inject(TYPES.SystemController)systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Member - Use-Case 1
    logout(sessionID: string): Promise<Result<void | SimpleGuest>> {
        let result: Result<void | SimpleGuest> = this.systemController.logout(sessionID);
        return new Promise<Result<void | SimpleGuest>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 4
    appointShopOwner(sessionID: string, newOwnerID: string, shopID: number, assigningOwnerID: string, title?: string,
                     permissions?: Permissions[]): Promise<Result<void>> {
        if(!permissions)
            permissions = new Array<Permissions>();
        let result: Result<void> = this.systemController.appointShopOwner(sessionID, {member: newOwnerID, shopId: shopID, assigner: assigningOwnerID,
            title: title, permissions: permissions});
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 6
    appointShopManager(sessionID: string, newManagerID: string, shopID: number, assigningOwnerID: string, title?: string,
                       permissions?: Permissions[]): Promise<Result<void>> {
        if(!permissions)
            permissions = new Array<Permissions>();
        let result: Result<void> = this.systemController.appointShopManager(sessionID, {member: newManagerID, shopId: shopID, assigner: assigningOwnerID,
            title: title, permissions: permissions});
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 7.1
    addPermissions(sessionID: string, promotedManagerID: string, shopID: number, permissions: Permissions): Promise<Result<void>> {
        let result: Result<void> = this.systemController.addShopManagerPermission(sessionID, promotedManagerID, shopID, permissions);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 7.2
    removePermissions(sessionID: string, demotedManagerID: string, shopID: number, permissions: Permissions): Promise<Result<void>> {
        let result: Result<void> = this.systemController.removeShopManagerPermission(sessionID, demotedManagerID, shopID, permissions);
        return new Promise<Result<void>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 11
    requestShopPersonnelInfo(sessionID: string, shopID: number): Promise<Result<void | SimpleMember[]>> {
        let result: Result<void | SimpleMember[]> = this.systemController.getPersonnelInfo(sessionID, shopID);
        return new Promise<Result<void | SimpleMember[]>>((resolve, reject) => {
            result.ok ? resolve(result) : reject(result.message);
        });
    }
}
