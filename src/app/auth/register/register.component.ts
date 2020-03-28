import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { AuthService } from "src/app/service/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  public formulario: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  public initForm() {
    this.formulario = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]]
    });
  }

  CreateUser() {
    if (this.formulario.invalid) return;

    const { name, email, password } = this.formulario.value;

    this.authService
      .CreateUser(name, email, password)
      .then(credentials => {
        this.router.navigate(["/"]);
      })
      .catch(console.log);
  }

  ReturnErrors(control: string): string {
    if (!this.formulario.get(`${control}`).touched) return "form-control";
    if (this.formulario.get(`${control}`).invalid) {
      return "form-control is-invalid";
    } else {
      return "form-control is-valid";
    }
  }
}
