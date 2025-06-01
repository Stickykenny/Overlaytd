import { Component } from "@angular/core";

import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-root",
  imports: [RouterModule, CommonModule],
  template: `
    <div id="sidebar" class="sidebar">
      <button
        id="sidebarhelper"
        class="sidebarhelper toggle-btn btn btn-light"
        (click)="toggleSidebar()"
      >
        >
      </button>
      <p>
        <br />
        <a routerLink="/login">Login</a>
      </p>

      <p>
        <br />
        <a routerLink="/grid">Grid</a>
      </p>
    </div>
    <main class="content">
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

  constructor() {}

  ngOnInit(): void {
    //this.http.getCsrf();
  }

  onSignedIn(): void {
    this.isLoggedIn = true;
  }
  toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar!.classList.toggle("uncollapsed");
    const sidebarhelper = document.getElementById("sidebarhelper");

    sidebarhelper!.classList.toggle("uncollapsed");
  }
}
