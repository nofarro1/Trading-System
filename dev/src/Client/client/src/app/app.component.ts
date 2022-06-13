import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn=false;
  title = 'client';

  userLogged($event:boolean){
    this.isLoggedIn=$event;
  }
}


