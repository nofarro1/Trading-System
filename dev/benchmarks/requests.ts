import memberData from "./members.json"
import productsData from "./products.json"
import {ProductCategory} from "../src/utilities/Enums";
type MemberData = {
    sessionId: string,
    username: string,
    password: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    country?: string
}

type ProductData = {
    id: number,
    category: string | ProductCategory,
    name: string,
    price: number,
    quantity: number,
    description?: string
}
const url = "https://localhost:" +3000+"/api";

export class requests {
    private memberCounter=0;
    private _membersData: MemberData[] = [];
    private productsData: ProductData[] = [];

    constructor() {
        memberData.forEach(memberData => this._membersData.push(memberData));
        productsData.forEach((productData) => this.productsData.push(productData));
    }

    public loginReq(){
        let username=this._membersData[this.memberCounter].username;
        let password=this._membersData[this.memberCounter].password;
        this.memberCounter++;
       return{
           method: 'POST',
           path: "/api/guest/login",
           setupRequest: (req, context) => {
               req.body = JSON.stringify({session: context.session, username: username, password: password})
               return req;
           }
       }
    }

    public accessReq() {
        return {
            method: 'GET',
            path: '/api/access',
            onResponse: (status, body, context) => {
                if (status === 200)
                    context.session = JSON.parse(body).data._guestID;
                else context.session = "not session passed"
            }
        }
    }
}