import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  imports: [CommonModule, FormsModule], //CommonModule required for ngFor
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  username: string = "visitor";
  password: string = "password";
  message: any;

  constructor(private service: ApiService, private router: Router) {}
  ngOnInit(): void {}

  doLogin(form: NgForm) {
    this.service.login(this.username, this.password);
    this.router.navigate(["/grid"]);
  }

  doget() {
    let response = this.service.getAstres();
    response.subscribe((data: any) => console.log(data));
  }
}
