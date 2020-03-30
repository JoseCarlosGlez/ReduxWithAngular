import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { map, pluck, switchMap } from "rxjs/operators";
import "firebase/firestore";
import { Usuario } from "../models/usuario.model";
import { AngularFirestore } from "@angular/fire/firestore";
import { Store } from "@ngrx/store";
import { AppState } from "src/Redux/app.reducers";
import * as authActions from "src/Redux/auth/auth.actions";
import { Subscription } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  public subscription: Subscription;
  constructor(
    private FireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAuthListener() {
    this.FireAuth.authState.subscribe(userFirebase => {
      console.log(userFirebase)

      if (userFirebase) {
        // existe
        this.subscription = this.firestore
          .doc(`${userFirebase.uid}/usuario`)
          .valueChanges()
          .subscribe((firestoreUser: any) => {

            const user = Usuario.FromFirebase(firestoreUser);
            this.store.dispatch(authActions.setUser({ user }));
          });
      } else {
    
        this.subscription?.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
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
