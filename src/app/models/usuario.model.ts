export class Usuario {
  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) {}

  public static FromFirebase({ email, uid, nombre }) {
    return new Usuario(uid, nombre, email);
  }
}
