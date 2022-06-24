import { Component } from '@angular/core';
import { api } from 'src/backendService/Service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  disableLoginBtn: boolean = true;
  showSignUp :boolean = false
  isLoggedIn :boolean = false;
  title = 'client';
  session: any;
  username: string = '';
  password: string = '';
  member: any;


  constructor(private service: api) {}

  async ngOnInit() {
    this.session = await this.service.accessMarketPlace();
    console.log(`the session that returned from accessMarketPlace is: ${this.session}`);
  }


  async afterSignUp(member: any) {
    this.showSignUp = false;
    this.loginUser(member["username"], member["password"]);  
  }
  
  async loginUser(username: string, password: string) {
    this.member = await this.service.login(this.session, username, password);
    if (this.member){
      this.isLoggedIn = true;
      console.log("login user: " + username);
    }
    else{
      console.log("Somthing went wrong with the log in");
    }
  }

  async logout() {
    await this.service.logoutMember(this.session, this.username);
    this.username = '';
    this.password = '';
    this.member = null;
    this.isLoggedIn = false;
  }
  
}
