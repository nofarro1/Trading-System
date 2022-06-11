import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { api } from 'src/backendService/Service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit, OnDestroy {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  form: FormGroup;
  submitted: boolean = false;
  service = new api();


  constructor(
    private formBuilder: FormBuilder,
    ){}

  ngOnInit(): void {
    const emailValidation = Validators.pattern(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ); 

    this.form = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, emailValidation]],
      country: ['', Validators.required]
    });
  }

  register(){
    this.submitted = true;
    this.service.register(
      this.form.get("username")?.value, 
      this.form.get("password")?.value, 
      this.form.get("firstname")?.value, 
      this.form.get("lastname")?.value, 
      this.form.get("email")?.value, 
      this.form.get("country")?.value);
  }


  // checkPasswords() {
  //   if (!this.passwordForm) {
  //     return null;
  //   }
  //   const password = this.passwordForm.get("password").value;
  //   const confirmPassword = this.passwordForm.get("confirmPassword").value;
  //   return password === confirmPassword ? null : { notSame: true };
  // }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
