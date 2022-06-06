import axios from "axios";
import {Result} from "../../../../utilities/Result";
import {interfaces} from "inversify";
import SimpleFactory = interfaces.SimpleFactory;
import {SimpleGuest} from "../../../../utilities/simple_objects/user/SimpleGuest";
import {SimpleShop} from "../../../../utilities/simple_objects/marketplace/SimpleShop";
import {SimpleMember} from "../../../../utilities/simple_objects/user/SimpleMember";

const base="https://localhost:4200/";
export class api {

  async accessMarketPlace(){
    const res = await axios.get(base);
    const data: Result<undefined | SimpleGuest> = res.data
    return data.data?.guestID
  }


  async getShopInfo(shopId: number, sessId: string){
    const res = await axios.get(base + sessId + "/" + shopId);
    const data: Result<undefined | SimpleShop> = res.data
    return data.data
  }


  async register(id: string, username: string, password: string, firstName: string, lastName: string, email: string, country: string){
    const res = await axios.post(base + "guest/register", {
      data: {
        id: id,
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        country: country
      }
    });
    const data: Result<undefined | SimpleMember> = res.data
    return data.data
  }
}
