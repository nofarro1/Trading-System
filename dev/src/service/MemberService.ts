import {Permissions} from "../utilities/Permissions";
import {Result} from "../utilities/Result";
import {SystemController} from "../domain/SystemController";
import {SimpleGuest} from "../utilities/simple_objects/user/SimpleGuest";
import {SimpleMember} from "../utilities/simple_objects/user/SimpleMember";
import {inject, injectable} from "inversify";
import {TYPES} from "../helpers/types";
import "reflect-metadata";
import {Message} from "../domain/notifications/Message";

@injectable()
export class MemberService {
    private systemController: SystemController;

    constructor(@inject(TYPES.SystemController)systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Member - Use-Case 1
    async logout(sessionID: string): Promise<Result<void | SimpleGuest>> {
        return this.systemController.logout(sessionID);
    }

    //Shop Owner - Modified Use-Case 4 according version 4
    appointShopOwner(sessionID: string, newOwnerID: string, shopID: number, assigningOwnerID: string): Promise<Result<void>> {
        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.submitOwnerAppointmentInShop(sessionID, shopID, newOwnerID, assigningOwnerID);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 6
    appointShopManager(sessionID: string, newManagerID: string, shopID: number, assigningOwnerID: string,
                       permissions?: Permissions[]): Promise<Result<void>> {

        return new Promise<Result<void>>((resolve, reject) => {
            if(!permissions)
                permissions = new Array<Permissions>();
            let result: Result<void> = this.systemController.appointShopManager(sessionID, {member: newManagerID, shopId: shopID, assigner: assigningOwnerID,
                permissions: permissions});
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 7.1
    addPermissions(sessionID: string, promotedManagerID: string, shopID: number, permissions: Permissions): Promise<Result<void>> {

        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.addShopManagerPermission(sessionID, promotedManagerID, shopID, permissions);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 7.2
    removePermissions(sessionID: string, demotedManagerID: string, shopID: number, permissions: Permissions): Promise<Result<void>> {

        return new Promise<Result<void>>((resolve, reject) => {
            let result: Result<void> = this.systemController.removeShopManagerPermission(sessionID, demotedManagerID, shopID, permissions);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    //Shop Owner - Use-Case 11
    requestShopPersonnelInfo(sessionID: string, shopID: number): Promise<Result<void | SimpleMember[]>> {

        return new Promise<Result<void | SimpleMember[]>>((resolve, reject) => {
            let result: Result<void | SimpleMember[]> = this.systemController.getPersonnelInfoOfShop(sessionID, shopID);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    getMessages(sessionId: string) {
        return new Promise<Result<void | Message[]>>((resolve, reject) => {
            let result: Result<void | Message[]> = this.systemController.getMessages(sessionId);
            result.ok ? resolve(result) : reject(result.message);
        });
    }

    approveOffer(sessionId: string, username: string, shopId:number, offerId: number, answer: boolean){
        return new Promise <Result<void>>((resolve, reject)=>{
            let result: Result<void> = this.systemController.approveOffer(sessionId, shopId, offerId, answer);
            result.ok ? resolve(result) : reject(result.message);
        })
    }

    checkAdminPermissions(sessionID: string, username: any, password: any) {
        return new Promise <Result<boolean>>((resolve, reject)=>{
            let result: Result<boolean> = this.systemController.checkAdminPermissions(sessionID,username,password);
            result.ok ? resolve(result) : reject(result.message);
        })
    }

    submitAppointmentAgreement(sessionID: string, newOwnerID: string, shopID: number, assigningOwnerID: string) {
        return Promise.resolve(undefined);
    }
}
