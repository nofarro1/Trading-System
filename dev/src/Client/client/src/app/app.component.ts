import { Component } from '@angular/core';
import { api } from 'src/backendService/Service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoggedIn = false;
  title = 'client';
  session: string | undefined;

  constructor(private service: api) {}

  async ngOnInit() {
    this.session = await this.service.accessMarketPlace();
    console.log(`the session that returned from accessMarketPlace is: ${this.session}`);
  }

  userLogged($event: boolean) {
    this.isLoggedIn = $event;
  }
}
