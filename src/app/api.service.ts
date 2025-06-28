import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Astre } from "./models/Astre";
import { BehaviorSubject, Observable } from "rxjs";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  isLogged = false;

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private loggedWithOauth = new BehaviorSubject<boolean>(false);

  // Observable for other components to subscribe to
  isLoggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    const token = localStorage.getItem("jwt");
    if (token != null) {
      var decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp != null) {
        if (Date.now() < decoded.exp * 1000) {
          this.loggedInSubject.next(true);
        }
      }
    }
  }

  getCsrfToken() {
    return this.http
      .get("http://localhost:8080/csrf/token", { withCredentials: true })
      .subscribe((data: any) => localStorage.setItem("csrf", data.token));
  }
  isOauth() {
    return this.loggedWithOauth.getValue();
  }

  public logOauth() {
    this.loggedInSubject.next(true);
    this.loggedWithOauth.next(true);
    console.log(this.loggedInSubject);
    return true;
  }

  public login(username: string, password: string) {
    const headers = new HttpHeaders({
      Authorization: "Basic " + btoa(username + ":" + password),
      // btoa binary to ascii
    });
    headers.set("access-control-allow-origin", "http://localhost:4200/");
    headers.set("withCredentials", "true");
    const body = { username, password };

    var response = this.http.post<string>("http://localhost:8080/login", body, {
      headers,
      //withCredentials: true,// cross-site Access-Control requests should be made using credentials such as cookies, authentication headers or TLS client certificates
      responseType: "text" as "json",
    });

    response.subscribe({
      next: (data: string) => {
        localStorage.setItem("jwt", data);
        this.loggedInSubject.next(true);
      },
      error: (err) => {
        console.error("Login failed:", err);
        return false;
      },
    });
    return true;
  }

  public logout() {
    localStorage.removeItem("jwt");
    this.loggedInSubject.next(false);
    this.router
      .navigate(["/"])
      .then(() =>
        this.toastr.success(
          "Please Login to access the app",
          "Logout Successful"
        )
      );
  }

  getAstres() {
    const headers = new HttpHeaders({});
    return this.http.get<Astre[]>("http://localhost:8080/api/astres/getall", {
      headers,
    });
  }

  postAstres(astres: Astre[]) {
    const headers = new HttpHeaders({});
    headers.set("access-control-allow-origin", "http://localhost:4200/");
    return this.http.post<Astre[]>(
      "http://localhost:8080/api/astres/astres",
      astres,
      {
        headers,
        withCredentials: true,
      }
    );
  }
  deleteAstre(type: string, name: string): boolean {
    const headers = new HttpHeaders({});
    headers.set("access-control-allow-origin", "http://localhost:4200/");
    this.http
      .delete<Astre[]>(
        "http://localhost:8080/api/astres/" + type + "/" + name,
        {
          headers,
          withCredentials: true,
        }
      )
      .subscribe({
        next: (response) => {
          console.log("Entry deleted!", response);
          return true;
        },
        error: (err) => {
          console.error("Delete failed", err);
          return false;
        },
      });
    return true;
  }
}
