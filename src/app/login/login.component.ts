import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { NavigationEnd, Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NavigateEvent } from "@angular/core/navigation_types.d-fAxd92YV";

@Component({
  selector: "app-login",
  imports: [CommonModule, FormsModule], //CommonModule required for ngFor
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  username: string = "visitor"; // Linked to [(ngModel)]
  password: string = "password";

  constructor(
    private service: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    router.events.subscribe((val) => {
      //console.log(val instanceof NavigationEnd);
    });
  }

  ngOnInit(): void {}

  loginWithGoogle() {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  }

  doLogin(form: NgForm) {
    // NgForm to fetch value from ngModel

    this.service.login(this.username, this.password).subscribe({
      next: (data: string) => {
        localStorage.setItem("jwt", data);
        this.service.logged();
        this.router
          .navigate(["/grid"])
          .then(() => this.toastr.success("yep yep yep", "Login Successful"));
      },
      error: (err) => {
        //console.error("Login failed:", err);
        this.toastr.error("", "Login failed");
      },
    });
  }
}
