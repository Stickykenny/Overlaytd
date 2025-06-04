import { HttpInterceptorFn } from "@angular/common/http";

// Class-based Interceptor (old version)
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class csrfInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log("In  csrfInterceptor");
    const csrfToken = localStorage.getItem("csrf"); // Implement token retrieval
    console.log("CRSF = " + csrfToken);
    if (csrfToken != null) {
      const modifiedReq = req.clone({
        setHeaders: {
          "X-CSRF-Token": csrfToken,
        },
      });
      console.log("new header csrf");

      console.log(req);
      //return next.handle(modifiedReq);
    }
    return next.handle(req);
  }
}
