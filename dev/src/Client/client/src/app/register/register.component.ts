import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { api } from 'src/backendService/Service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    @Input() session: string | undefined;
    clicked: boolean = false;

  constructor(private router: Router) { 
      console.log("ses in register = " + this.session);
  }

  async ngOnInit() {}



}
 