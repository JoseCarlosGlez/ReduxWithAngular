import { Component, OnInit,OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";
import { AuthService } from "src/app/service/auth.service";
import { Router } from "@angular/router";

import swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { AppState } from "src/Redux/app.reducers";
import { Subscription } from "rxjs";
import * as ui from "src/Redux/ui/ui.actions";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  uiSubscription: Subscription;
  public formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.uiSubscription = this.store
      .select("ui")
      .subscribe(({ isLoading }) => (this.isLoading = isLoading));
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.uiSubscription.unsubscribe();
  }

  public initForm() {
    this.formulario = this.fb.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]]
    });
  }

  CreateUser() {
    if (this.formulario.invalid) {
      swal.fire({
        title: "Hay campos invalidos",
        icon: "error"
      });
      return;
    }

    this.store.dispatch(ui.isLoading());

    const { name, email, password } = this.formulario.value;

    this.authService
      .CreateUser(name, email, password)
      .then(credentials => {
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(["/"]);
      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading());
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
}
