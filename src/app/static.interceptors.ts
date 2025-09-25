import { HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { of } from "rxjs";

// This Interceptor is for voiding all api call to server for prod static environnement
// Functionnal Interceptor (Angular 15+)
export const StaticInterceptor: HttpInterceptorFn = (req, next) => {
  const staticCheck: boolean = environment.production;
  if (!staticCheck) {
    return next(req);
  }
  console.log("Environment is static, so any api call is cleaned");
  return of(new HttpResponse({ body: [] }));
};
