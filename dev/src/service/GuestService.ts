import {SystemController} from "../domain/controller/SystemController";
import {Result} from "../utilities/Result";
import {LoginData, RegisterMemberData} from "../utilities/DataObjects";
import {Member} from "./simple_objects/user/Member";
import {Member as DomainMember} from "../domain/user/Member";


export class GuestService {
    systemController: SystemController;

    constructor(systemController: SystemController) {
        this.systemController = systemController;
    }

    //General Guest - Use-Case 3
    register(guestId: number, registrationData: RegisterMemberData): Result<void> {
        return this.systemController.registerMember(guestId, registrationData);
    }

    //General Admin - Use-Case 0
    registerAdmin(guestId: number, registrationData: RegisterMemberData): Result<void> {
        return this.systemController.registerAsAdmin(guestId, registrationData);
    }

    //General Guest - Use-Case 4
    login(guestID: number, loginData: LoginData): Result<Member> {
        // const domainResult: Result<DomainMember> = this.systemController.login(guestID, loginData);
        // let result: Result<Member> = new Result <Member>(domainResult.ok, null, domainResult.message);
        // if(domainResult.ok) {
        //     const domainMember = domainResult.data;
        //     result.data = new Member(domainMember.id, domainMember.name); //TODO - configure roles
        // }
        // return result;
        return null;
    }
}
