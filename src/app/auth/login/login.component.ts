import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "src/app/service/auth.service";
import { Router } from "@angular/router";

import swal from "sweetalert2";
import { Store } from "@ngrx/store";
import { AppState } from "src/Redux/app.reducers";
import * as ui from "src/Redux/ui/ui.actions";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {
  public formulario: FormGroup;
  public isLoading: boolean;

  public uisubscription$: Subscription;

  constructor(
    public fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initForms();

    this.uisubscription$ = this.store
      .select("ui")
      .subscribe(ui => {
        this.isLoading = ui.isLoading;
      });
  }

  ngOnDestroy() {
    this.uisubscription$.unsubscribe();
  }

  initForms() {
    this.formulario = this.fb.group({
      email: ["jc1@gmail.com", [Validators.required, Validators.email]],
      password: ["12345678", [Validators.required, Validators.minLength(8)]]
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
      return;
    }

    this.store.dispatch(ui.isLoading());
    // this.store.dispatch(ui.stopLoading());

    // swal.fire({
    //   title: "Espere por Favor",
    //   onBeforeOpen: () => {
    //     swal.showLoading();
    //   }
    // });
    const { email, password } = this.formulario.value;

    this.authService
      .Loginuser(email, password)
      .then(credentials => {
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(["/"]);
      })
      .catch(error => {
        this.store.dispatch(ui.stopLoading());
        swal.fire({
          title: `${error.message}`,
          icon: "error"
        });
      });
  }
}
