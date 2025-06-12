import { Component } from "@angular/core";

import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ApiService } from "./api.service";
@Component({
  selector: "app-root",
  imports: [RouterModule, CommonModule],
  template: `
    <button
      id="sidebarhelper"
      class="sidebarhelper toggle-btn btn btn-light"
      (click)="toggleSidebar()"
    >
      >
    </button>
    <div id="sidebar" class="sidebar">
      <p>
        <br />
        <a routerLink="/login">Login</a>
      </p>
      <p *ngIf="isLoggedIn">
        <a routerLink="/grid">Grid</a>
        <br />
        <br />
        <a (click)="logout()" routerLink="/">Logout</a>
      </p>
    </div>
    <main class="content">
      <header class="brand-name">
        <img
          class="brand-logo"
          src="/assets/logo.svg"
          alt="logo"
          aria-hidden="true"
        />
      </header>
      <section class="content">
        <router-outlet></router-outlet>
        <!-- Dynamic load based on route -->
      </section>
    </main>
  `,
  styleUrls: ["./app.component.css"],
})
//replaced the <app-home></app-home> tag with the <router-outlet> directive
export class AppComponent {
  title = "homes";
  isLoggedIn = false;

  constructor(private auth: ApiService) {
    this.auth.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  ngOnInit(): void {
    //this.http.getCsrf();
  }

  ngAfterViewInit() {}

  onSignedIn(): void {
    this.isLoggedIn = true;
  }
  logout(): void {
    this.auth.logout();
  }
  toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar!.classList.toggle("uncollapsed");
    const sidebarhelper = document.getElementById("sidebarhelper");

    sidebarhelper!.classList.toggle("uncollapsed");
  }
}
