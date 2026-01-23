import { HttpInterceptorFn } from "@angular/common/http";
import { jwtDecode, JwtPayload } from "jwt-decode";

// Functionnal Interceptor (Angular 15+)
// This isn't used anymore (Jwt token are now in cookie http-only)
export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("jwt");
  if (token != null) {
    console.log("token not null");
    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),
    });
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.exp != null) {
      if (Date.now() >= decoded.exp * 1000) {
        console.log("expired");
        return next(req);
      }
    }
    return next(authReq);
  }
  const authReq = req.clone({
    withCredentials: true,
  });
  return next(authReq);
};
