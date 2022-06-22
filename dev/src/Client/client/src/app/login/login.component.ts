import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { api } from '../../backendService/Service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { SimpleMember } from '../../../../../utilities/simple_objects/user/SimpleMember';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  username$ = new BehaviorSubject<string>(this.username);
  password$ = new BehaviorSubject<string>(this.password);
  form: FormGroup;
  @Input() session: string | undefined;

  disable: boolean = false;

  @Output() logged = new EventEmitter<boolean>();
  constructor(private service: api, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: [
        '',
        [Validators.required, Validators.minLength(6)],
      ],
    });
  }

  async loginClick(username: string, password: string) {
    this.disable = true;
    console.log(`username: ${username}, password: ${password}`);
    let ans = await this.service.login(this.username, this.password);
    if (ans){
      // show user page / cart ...
    }
    else {
      // msg tat couldn't connect 
    }

    // let res=this.service.login(username,password);
    // if(res instanceof SimpleMember){
      //   this.logged.emit(true);
      // }else{
        //   console.log("tryagain");
        // }
    this.disable = false;
  }
}
