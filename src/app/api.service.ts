import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Astre, AstreID } from "./models/Astre";
import { BehaviorSubject, Observable, take } from "rxjs";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { cp } from "fs";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  isLogged = false;
  loginData = { username: "", password: "" };

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private loggedWithOauth = new BehaviorSubject<boolean>(false);

  // Observable for other components to subscribe to
  readonly isLoggedIn$: Observable<boolean> =
    this.loggedInSubject.asObservable();
  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    /*const token = localStorage.removeItem("jwt");
    if (token != null) {
      var decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp != null) {
        if (Date.now() < decoded.exp * 1000) {
          this.loggedInSubject.next(true);
        }
      }
    }*/
  }

  getCsrfToken() {
    return this.http
      .get("http://localhost:8080/csrf/token", { withCredentials: true })
      .subscribe((data: any) => localStorage.setItem("csrf", data.token));
  }
  isOauth() {
    return this.loggedWithOauth.getValue();
  }

  public logged() {
    this.loggedInSubject.next(true);
    return true;
  }

  public logOauth() {
    this.logged();
    this.loggedWithOauth.next(true);
    console.log(this.loggedInSubject);
    return true;
  }

  public login(usernameInput: string, passwordInput: string) {
    return this.http.post(
      "http://localhost:8080/login2",
      {
        username: usernameInput,
        password: passwordInput,
      },
      {
        headers: {
          "access-control-allow-origin": "http://localhost:4200/",
          withCredentials: "true",
          "Content-Type": "application/json",
          accept: "application/hal+json",
        },
        responseType: "text" as "json",
      }
    );
  }

  /*this.http.post<string>("http://localhost:8080/login", body, {
      headers,
      //withCredentials: true,// cross-site Access-Control requests should be made using credentials such as cookies, authentication headers or TLS client certificates
      responseType: "text" as "json",
    });*/

  public logout() {
    this.loggedInSubject.next(false);

    console.log("in logout service");
    this.http
      .post("http://localhost:8080/logout", {}, { withCredentials: true })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.router
            .navigate(["/login"])
            .then(() =>
              this.toastr.success(
                "Please Login to access the app",
                "Logout Successful"
              )
            );
        },
        error: (err) => {
          console.log(err);
          this.toastr.error(err, "Observable Error logging out");
        },
      });
    console.log("Getting after post logout");
  }

  getAstres(): Observable<Astre[]> {
    console.log("Getting Astres");
    const headers = new HttpHeaders({});
    return this.http.get<Astre[]>(
      "http://localhost:8080/api/astres/getall",
      {}
    );
  }

  getLocalAstres() {
    return this.http.get<Astre[]>("assets/exampleData.json");
  }

  postAstres(astres: Astre[]) {
    const headers = new HttpHeaders({});
    headers.set("access-control-allow-origin", "http://localhost:4200/");
    return this.http.post<Astre[]>(
      "http://localhost:8080/api/astres/astres",
      astres
    );
  }
  deleteAstre(
    type: string,
    subtype: string,
    name: string
  ): Observable<Astre[]> {
    const headers = new HttpHeaders({});
    const astreID: AstreID = { type, subtype, name };
    headers.set("access-control-allow-origin", "http://localhost:4200/");
    return this.http.delete<Astre[]>("http://localhost:8080/api/astres/astre", {
      headers,
      body: astreID,
    });
  }

  getUserDetails() {
    const headers = new HttpHeaders({});

    return this.http.get<Astre[]>("http://localhost:8080/userDetails", {
      headers,
    });
  }
}
