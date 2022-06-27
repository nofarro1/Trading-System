import { Component } from '@angular/core';
import { api } from 'src/backendService/Service';
import { PrimeNGConfig } from 'primeng/api';
import { JobType } from '../../../../utilities/Enums';
import { SimpleMember } from '../../../../utilities/simple_objects/user/SimpleMember';
import { SimpleGuest } from '../../../../utilities/simple_objects/user/SimpleGuest';
import { MessageService } from 'primeng/api';
import { SimpleShop } from '../../../../utilities/simple_objects/marketplace/SimpleShop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MessageService],
})
export class AppComponent {
  shopToShow: SimpleShop;
  disableLoginBtn: boolean = true;
  isLoggedIn: boolean = false;
  title = 'client';
  session: any;
  username: string = '';
  password: string = '';
  member: SimpleMember | void;
  ADMIN: number = JobType.admin;

  showSignUp: boolean = false;
  showShops: boolean = false;
  showShop: boolean = false;
  showCart: boolean = false;
  showHome: boolean = true;

  constructor(
    private service: api,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    this.primengConfig.ripple = true;
    this.session = await this.service.accessMarketPlace();
    console.log(
      `the session that returned from accessMarketPlace is: ${this.session}`
    );
  }

  async afterSignUp(member: any) {
    this.showSignUp = false;
    this.loginUser(member['username'], member['password']);
  }

  goToPage(tab: string) {
    if (tab === 'home') {
      this.showHome = true;
      this.showCart = false;
      this.showShops = false;
      this.showShop = false;
      this.showSignUp = false;
    } else if (tab === 'shops') {
      this.showHome = false;
      this.showCart = false;
      this.showShops = true;
      this.showShop = false;
      this.showSignUp = false;
    } else if (tab === 'cart') {
      this.showHome = false;
      this.showCart = true;
      this.showShops = false;
      this.showShop = false;
      this.showSignUp = false;
    } else if (tab === 'signup') {
      this.showHome = false;
      this.showCart = false;
      this.showShops = false;
      this.showShop = false;
      this.showSignUp = true;
    } else if (tab === 'shop') {
      this.showHome = false;
      this.showCart = false;
      this.showShops = false;
      this.showShop = true;
      this.showSignUp = false;
    }
  }

  async loginUser(username: string, password: string) {
    this.member = await this.service.login(this.session, username, password);
    console.log(this.member);
    if (this.member) {
      this.username = this.member["_username"];
      this.isLoggedIn = true;
      console.log('login user: ' + this.username);
    } else {
      console.log('Somthing went wrong with the log in');
    }
  }

  async logout() {
    console.log('logout');
    let ans = await this.service.logoutMember(this.session, this.username);
    console.log(ans);
    if (ans instanceof SimpleGuest) {
      this.username = '';
      this.password = '';
      this.member = undefined;
      this.isLoggedIn = false;
      this.goToPage('home');
    } else {
      this.showErrorMsg("Error logout from the system");
    }
  }

  goToShop(shop: SimpleShop) {
    this.shopToShow = shop;
    this.goToPage('shop');
  }

  showErrorMsg(msg: string) {
    this.messageService.add({
      severity: 'error',
      key: 'tc',
      summary: 'Error',
      detail: msg,
    });
  }

  showSuccessMsg(msg: string) {
    this.messageService.add({
      severity: 'success',
      key: 'tc',
      summary: 'success',
      detail: msg,
    });
  }
}
