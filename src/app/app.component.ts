import { Component } from "@angular/core";

import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { Astre } from "./models/Astre";
import { HttpClient } from "@angular/common/http";
import { MediaDockComponent } from "./components/media-dock/media-dock.component";
@Component({
  selector: "app-root",
  imports: [RouterModule, CommonModule, MediaDockComponent],
  template: `
    <button
      id="sidebarhelper"
      class="sidebarhelper toggle-btn btn btn-light"
      (click)="toggleSidebar()"
    >
      >
    </button>

    <button
      id="collapsezone"
      class="collapsezone"
      (click)="toggleSidebar()"
    ></button>

    <div id="sidebar" class="sidebar">
      <p>
        <br />
        <a routerLink="/login">Login</a>
        <br />
        <br />
        <a routerLink="/grid">Grid</a>
        <br />
        <br />
        <a routerLink="/tree">Tree</a>
      </p>
      <p *ngIf="isLoggedIn$">
        <a routerLink="/home">Home</a>
        <br />
        <br />
        <a (click)="logout()">Logout</a>
      </p>
    </div>

    <main class="content">
      <header class="brand-name">
        <pre>   <i
          class="bi bi-house-door-fill cns-gradient"
          style="font-size: 2rem;"
          aria-hidden="true"
          (click)="rdm()"
          ><span class ="cns-gradient cns-gradient-text-strech">  CNS</span></i
        ></pre>
      </header>
      <app-media-dock></app-media-dock>
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
  isLoggedIn$: Observable<boolean>;

  constructor(
    private auth: ApiService,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }

  ngOnInit(): void {}

  logout(): void {
    localStorage.clear();
    this.auth.logout();
  }
  toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar!.classList.toggle("uncollapsed");
    const sidebarhelper = document.getElementById("sidebarhelper");
    sidebarhelper!.classList.toggle("uncollapsed");
    const collapsezone = document.getElementById("collapsezone");
    collapsezone!.classList.toggle("uncollapsed");
  }

  rdm() {
    this.toastr.info("Clicked on home");

    /*console.log("Logging Local Storage");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        console.log("key =" + key + " | value = " + value);
      }
    }
    var c = 0;
    this.http
      .get<Astre[]>("http://localhost:8080/api/astres/welcome", {})
      .subscribe()
      .unsubscribe();
    console.log(c);*/
  }
}
