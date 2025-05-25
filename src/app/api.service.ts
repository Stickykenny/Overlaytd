import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Astre } from "./models/Astre";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public login(username: string, password: string) {
    let username1 = "visitor";
    let password1 = "password";
    const headers = new HttpHeaders({
      Authorization: "Basic " + btoa(username1 + ":" + password1),
      // btoa binary to ascii
    });
    headers.set("access-control-allow-origin", "http://localhost:4200/");

    headers.set("withCredentials", "true");
    const body = { username, password };

    return this.http.post<string>("http://localhost:8080/login", body, {
      headers,
      //withCredentials: true,// cross-site Access-Control requests should be made using credentials such as cookies, authentication headers or TLS client certificates
      responseType: "text" as "json",
    });
  }
  getAstres() {
    let username = "visitor";
    let password = "password";
    const headers = new HttpHeaders({
      Authorization: "Basic " + btoa(username + ":" + password),
    });
    return this.http.get<Astre[]>("http://localhost:8080/api/astres/getall", {
      headers,
    });
  }

  postAstres(astres: Astre[]) {
    const headers = new HttpHeaders({
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    });
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
}
