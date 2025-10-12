import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { environment } from "../environments/environment";
import { throwError } from "rxjs";

// This Interceptor is for voiding all api call to server for prod static environnement
// Functionnal Interceptor (Angular 15+)
export const StaticInterceptor: HttpInterceptorFn = (req, next) => {
  const staticCheck: boolean = environment.production;
  let allowedDomains: string[] = environment.allowedDomains;
  allowedDomains.push(environment.exampleDataPath);
  for (var i = 0; i < allowedDomains.length; i++) {
    if (!staticCheck || req.url.startsWith(allowedDomains[i])) {
      return next(req);
    }
  }

  console.log("Environment is static, so any api call is cleaned");
  return throwError(
    () =>
      new HttpErrorResponse({
        error: { message: "Static mode: API call blocked" },
        status: 503,
        statusText: "Service Unavailable",
        url: req.url,
      })
  );
};
