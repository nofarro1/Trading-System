import { JsonpClientBackend } from '@angular/common/http';
import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';

import { api } from '../../backendService/Service';

import { Country, countries } from '../../models/countries_data';
import { SimpleMember } from '../../../../../utilities/simple_objects/user/SimpleMember';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [MessageService],
})
export class SignupComponent implements OnInit, OnDestroy {
  @Input() session: any;
  @Output() registerMember = new EventEmitter<any>();
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject();
  form: FormGroup;
  submitted: boolean = false;
  countries: any = countries;
  selectedCountry: Country;

  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;

  constructor(
    private service: api,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    console.log(`in signup, session = ${this.session}`);

    const emailValidation = Validators.pattern(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    this.form = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, emailValidation]],
      country: ['', Validators.required],
    });
  }

  async register() {
    this.submitted = true;
    this.username = this.form.get('username')?.value;
    this.password = this.form.get('password')?.value;
    this.firstName = this.form.get('firstname')?.value;
    this.lastName = this.form.get('lastname')?.value;
    this.email = this.form.get('email')?.value;
    this.country = this.form.get('country')?.value;

    await this.service
      .register(
        this.session,
        this.username,
        this.password,
        this.firstName,
        this.lastName,
        this.email,
        this.country
      )
      .then((member: {_username: string, _roles: any[]}) => {
        this.registerMember.emit({
            username: member._username,
            password: this.password,
          });
      }).catch((error) => {
        this.showErrorMsg(error);
      });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  showErrorMsg(msg: string) {
    this.messageService.add({
      severity: 'error',
      key: 'tc',
      summary: 'Error',
      detail: msg,
    });
  }

  showSuccessMsg(msg : string) {
    this.messageService.add({
      severity: 'success',
      key: 'tc',
      summary: 'success',
      detail: msg,
    });
  }

}
