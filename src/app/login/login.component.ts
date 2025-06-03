import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

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
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {}

  doLogin(form: NgForm) {
    // NgForm to fetch value from ngModel
    if (this.service.login(this.username, this.password)) {
      this.router
        .navigate(["/grid"])
        .then(() => this.toastr.success("yep yep yep", "Login Successful"));
    }
  }
}
