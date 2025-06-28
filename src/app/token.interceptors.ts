import { HttpInterceptorFn } from "@angular/common/http";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { ApiService } from "./api.service";
import { inject } from "@angular/core";

// Functionnal Interceptor (Angular 15+)
export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  //const apiService = inject(ApiService);

  const token = localStorage.getItem("jwt");
  if (token != null) {
    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),
    });
    const decoded = jwtDecode<JwtPayload>(token);
    const decodedHeader = jwtDecode(token, { header: true });
    if (decoded.exp != null) {
      if (Date.now() >= decoded.exp * 1000) {
        console.log("expired");
        return next(req);
      }
      //console.log("Token = " + token);
    }
    return next(authReq);
  }
  return next(req);
};
