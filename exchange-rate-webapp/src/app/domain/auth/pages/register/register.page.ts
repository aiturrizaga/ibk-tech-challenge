import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "@ibk/core/services";
import { RegisterRequest } from "@ibk/core/interfaces";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './register.page.html',
  styles: ``
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup = new FormGroup({});

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private readonly router: Router) {
  }

  ngOnInit(): void {
    this.initRegisterForm();
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.value as RegisterRequest)
      .subscribe(() => this.router.navigateByUrl('/exchange-rate'));
  }

  initRegisterForm() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
    })
  }

  hasError(formControl: string) {
    return (this.form[formControl].dirty || this.form[formControl].touched) && this.form[formControl].errors;
  }

  get form() {
    return this.registerForm.controls;
  }
}
