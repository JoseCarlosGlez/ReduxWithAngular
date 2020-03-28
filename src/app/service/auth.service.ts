import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { map } from "rxjs/operators";
import 'firebase/firestore'
import { Usuario } from "../models/usuario.model";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(
    private FireAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  initAuthListener() {
    this.FireAuth.authState.subscribe(fuser => {
      console.log(fuser);
    });
  }

  CreateUser(nombre: string, email: string, password: string) {
    return this.FireAuth.createUserWithEmailAndPassword(email, password).then(
      ({ user }) => {
        const newUser = new Usuario(user.uid, nombre, email);
        return this.firestore.doc(`${newUser.uid}/usuario`).set({...newUser});
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
