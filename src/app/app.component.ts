import { Component } from "@angular/core";

import { RouterModule } from "@angular/router";
import { GridComponent } from "./components/grid/grid.component";
import { LoginComponent } from "./login/login.component";
import { MyHttpClient } from "./httpclient";
@Component({
  selector: "app-root",
  imports: [RouterModule, GridComponent, LoginComponent],
  template: `
    <main>
      <a [routerLink]="['/']">
        <header class="brand-name">
          <img
            class="brand-logo"
            src="/assets/logo.svg"
            alt="logo"
            aria-hidden="true"
          />
        </header>
      </a>
      sdsd
      <app-login></app-login>

      <section class="content">
        <app-grid></app-grid>
        <!-- <router-outlet></router-outlet>-->
      </section>
    </main>
  `,
  styleUrls: ["./app.component.css"],
})
//replaced the <app-home></app-home> tag with the <router-outlet> directive
export class AppComponent {
  title = "homes";
  authenticated = false;

  constructor(private http: MyHttpClient) {}

  ngOnInit(): void {
    //this.http.getCsrf();
  }

  onSignedIn(): void {
    this.authenticated = true;
  }
}
