import {Service} from "../service/Service";
import {resetContainer} from "../helpers/inversify.config";
import {Result} from "../utilities/Result";


export class StateInitializer {
    service: Service;
    private DataSource: any;

    constructor(service:Service, DataSource){
        this.service = service;
        this.DataSource = DataSource;
    }

    //initialize the system with data.
    initialize(){
        //register members.... 10 members
        //createShops... 4 shops
        //add products to shop... 5 products per shop
        //appoint manager ... 2 managers in different shops
        //appoint shop Owner... 2 AdditionalOwners
    }

    reset(){
        try{
            resetContainer()
            //datasource.clearDatabase
            return Result.Ok(true, "successfully reset the system");
        } catch(e){
            return Result.Fail("unexpected Failure happened during reset");
        }

    }



}