import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LoginHandlerService } from "./login.handler.service";
import { SharedModule } from "../shared.module";

@Component({
  selector: "app-login",
  imports: [SharedModule], //CommonModule required for ngFor
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  username: string = "visitor"; // Linked to [(ngModel)]
  password: string = "password";

  constructor(
    private service: ApiService,
    private loginHandler: LoginHandlerService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  loginWithGoogle() {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  }

  doLogin(form: NgForm) {
    // NgForm to fetch value from ngModel
    let a = this.service.login(this.username, this.password);

    this.route.queryParamMap.subscribe((params) => {
      const jwtToken = params.get("token");
      if (jwtToken != null) {
        console.log("valid token");
        localStorage.setItem("jwt", jwtToken);
      }
    });

    a.subscribe({
      next: (jwtKey: any) => {
        this.loginHandler.handle(jwtKey);
      },
      error: (err) => {
        console.error("Login failed:", err);
        this.toastr.error("", "Login failed");
      },
    });
  }
}
