import { HttpInterceptorFn } from "@angular/common/http";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { catchError, switchMap, take, throwError } from "rxjs";
import { ApiService } from "./api.service";
import { inject } from "@angular/core";
import { ToastrService } from "ngx-toastr";

// Functionnal Interceptor (Angular 15+)
// In case of error, this project will retry after trying to fetch a refresh token
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    withCredentials: true,
  });

  if (req.url.includes("/auth/")) {
    return next(authReq);
  }

  const apiService = inject(ApiService);
  const toastrService = inject(ToastrService);
  return next(authReq).pipe(
    catchError((error) => {
      return apiService.refresh().pipe(
        take(1),
        switchMap(() => {
          toastrService.info("refresh Token");
          return next(authReq);
        }),
        catchError((error) => {
          toastrService.error("Failed to refresh Token");
          console.log("Failed to refresh Token");
          return throwError(() => error);
        })
      );
    })
  );
};
