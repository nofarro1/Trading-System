import {SystemController} from "../domain/controller/SystemController";
import {Result} from "../utilities/Result";
import {LoginData, RegisterMemberData} from "../utilities/DataObjects";
import {Member} from "./simple_objects/user/Member";
import {Member as DomainMember} from "../domain/user/Member";


export class GuestService {
    private systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 3
    register(guestID: number, username: string, password: string, firstName?: string, lastName?: string, email?: string, country?: string): Result<void> {
        return this.systemController.registerMember(guestID, {username: username, password: password, firstName: firstName, lastName: lastName, email: email, country: country});
    }

    //General Admin - Use-Case 0
    registerAdmin(guestID: number, username: string, password: string, firstName?: string, lastName?: string, email?: string, country?: string): Result<void> {
        return this.systemController.registerAsAdmin(guestID, {username: username, password: password, firstName: firstName, lastName: lastName, email: email, country: country});
    }

    //General Guest - Use-Case 4
    login(guestID: number, username: string, password: string): Result<Member> {
        // const domainResult: Result<DomainMember> = this.systemController.login(guestID, {username: string, password: string});
        // let result: Result<Member> = new Result <Member>(domainResult.ok, null, domainResult.message);
        // if(domainResult.ok) {
        //     const domainMember = domainResult.data;
        //     result.data = new Member(domainMember.id, domainMember.name); //TODO - configure roles
        // }
        // return result;
        // @ts-ignore
        return null;
    }
}
