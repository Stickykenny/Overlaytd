import { Component, OnInit } from "@angular/core";
import { ApiService } from "../api.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-login",
  imports: [CommonModule, FormsModule], //CommonModule required for ngFor
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  message: any;

  constructor(private service: ApiService) {}
  ngOnInit(): void {}

  doLogin() {
    let response = this.service.login(this.username, this.password);
  }

  doget() {
    let response = this.service.getAstres();
    response.subscribe((data: any) => console.log(data));
  }
}
