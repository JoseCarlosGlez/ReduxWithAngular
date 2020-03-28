import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/service/auth.service";
import { Router } from "@angular/router";

import swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styles: []
})
export class LoginComponent implements OnInit {
  public formulario: FormGroup;

  constructor(
    public fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms() {
    this.formulario = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]]
    });
  }

  ReturnErrors(control: string): string {
    if (!this.formulario.get(`${control}`).touched) return "form-control";
    if (this.formulario.get(`${control}`).invalid) {
      return "form-control is-invalid";
    } else {
      return "form-control is-valid";
    }
  }

  UserLog() {
    if (this.formulario.invalid) {
      swal.fire({
        title: "Hay campos invalidos",
        icon: "error"
      });
      return
    }
    const { email, password } = this.formulario.value;

    this.authService
      .Loginuser(email, password)
      .then(credentials => this.router.navigate(["/"]))
      .catch(error => {
        swal.fire({
          title: `${error.message}`,
          icon: "error"
        });
      });
  }
}
