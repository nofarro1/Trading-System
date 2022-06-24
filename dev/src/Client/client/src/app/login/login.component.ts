import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import {api} from "../../backendService/Service.service";
import {SimpleMember} from "../../../../../utilities/simple_objects/user/SimpleMember";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // serv=new api();
  @Output() logged=new EventEmitter<boolean>();
  constructor(private service: api,) {
  }

  ngOnInit(): void {
  }

  loginClick(username: string,password: string){
      // let res=this.service.login(username,password);
      // if(res instanceof SimpleMember){
      //   this.logged.emit(true);
      // }else{
      //   console.log("tryagain");
      // }
  }
}
