import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { api } from 'src/backendService/Service';

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


  constructor(
    private service: api,
    private formBuilder: FormBuilder,
    ){}

  ngOnInit(): void {
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

  register(){
    this.submitted = true;
    console.log('register');
    this.service.register(
      this.form.get("username")?.value,
      this.form.get("password")?.value,
      this.form.get("firstname")?.value,
      this.form.get("lastname")?.value,
      this.form.get("email")?.value,
      this.form.get("country")?.value);
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
