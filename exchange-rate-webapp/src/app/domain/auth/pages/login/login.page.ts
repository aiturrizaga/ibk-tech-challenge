import { Component, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "@ibk/core/services";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgClass],
  templateUrl: './login.page.html'
})
export class LoginPage implements OnInit {

  loginForm: FormGroup = new FormGroup({});
  returnUrl: string = '';

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private readonly router: Router,
              private readonly route: ActivatedRoute) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/exchange-rate';
  }

  ngOnInit(): void {
    this.initLoginForm();
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value)
      .subscribe(() => this.router.navigateByUrl(this.returnUrl));
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    })
  }

  hasError(formControl: string) {
    return (this.form[formControl].dirty || this.form[formControl].touched) && this.form[formControl].errors;
  }

  get form() {
    return this.loginForm.controls;
  }

}
