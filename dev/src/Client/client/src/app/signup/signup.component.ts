import { JsonpClientBackend } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { api } from '../../backendService/Service';

import { Country, countries } from '../../models/countries_data'


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  form: FormGroup;
  submitted: boolean = false;
  countries: any = countries;
  selectedCountry: Country;

  session: string|undefined;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;


  constructor(
    private service: api,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
    ){}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.session = params.get('session') || undefined; // Print the parameter to the console. 
      console.log("session = " + this.session); // Print the parameter to the console. 
  });

    const emailValidation = Validators.pattern(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    const passwordValidation = Validators.pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/)

    this.form = this.formBuilder.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6), passwordValidation]],
      email: ['', [Validators.required, emailValidation]],
      country: ['', Validators.required]
    });
  }

  async register(){
    this.submitted = true;
    this.username = this.form.get('username')?.value;
    this.password = this.form.get('password')?.value;
    this.firstName = this.form.get('firstname')?.value;
    this.lastName = this.form.get('lastname')?.value;
    this.email = this.form.get('email')?.value;
    this.country = this.form.get('country')?.value;
    console.log(`username: ${this.username}, password: ${this.password}, firstName: ${this.firstName}, lastName: ${this.lastName}, email: ${this.email}, country: ${this.country}`);

    let member = await this.service.register(this.session, this.username, this.password, this.firstName, this.lastName, this.email, this.country).then((value) => value? value : undefined);
    console.log("member = " + member);
    if (member){
      await this.service.login(this.username, this.password).then(value => value ? console.log("member registered and logged in") : console.log("not logged in"));
    }

  };

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
