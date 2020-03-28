import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/service/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styles: []
})
export class SidebarComponent implements OnInit {
  constructor(private AuthService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logOut() {
    this.AuthService.logoutFromService().then(() => {
      this.router.navigate(["/login"]);
    });
  }
}
