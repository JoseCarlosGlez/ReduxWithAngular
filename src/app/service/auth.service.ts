import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { map, pluck, switchMap, filter, tap } from "rxjs/operators";
import "firebase/firestore";
import { Usuario } from "../models/usuario.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store } from "@ngrx/store";
import { AppState } from "src/Redux/app.reducers";
import * as authActions from "src/Redux/auth/auth.actions";
import { Subscription, empty } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private FireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.FireAuth.authState
      .pipe(
        tap(() => this.store.dispatch(authActions.unSetUser())),
        filter(fbUser => fbUser != null),
        switchMap(({ uid }) =>
          this.firestore.doc(`${uid}/usuario`).valueChanges()
        )
      )
      .subscribe((userFirebase: Usuario) => {
        const user = Usuario.FromFirebase(userFirebase);
        this.store.dispatch(authActions.setUser({ user }));
      });
  }

  CreateUser(nombre: string, email: string, password: string) {
    return this.FireAuth.createUserWithEmailAndPassword(email, password).then(
      ({ user }) => {
        const newUser = new Usuario(user.uid, nombre, email);
        return this.firestore.doc(`${newUser.uid}/usuario`).set({ ...newUser });
      }
    );
  }

  Loginuser(email: string, password: string) {
    return this.FireAuth.signInWithEmailAndPassword(email, password);
  }

  logoutFromService() {
    return this.FireAuth.signOut();
  }

  isAuth() {
    return this.FireAuth.authState.pipe(map(data => data != null));
  }
}
