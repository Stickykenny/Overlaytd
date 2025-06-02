import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { ApiService } from "./api.service";
import { jwtDecode, JwtPayload } from "jwt-decode";

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(ApiService);
  const token = localStorage.getItem("jwt");
  if (token != null) {
    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),
    });
    const decoded = jwtDecode<JwtPayload>(token);
    //console.log(decoded);
    //console.log("---------");
    const decodedHeader = jwtDecode(token, { header: true });
    //console.log(decodedHeader);
    if (decoded.exp != null) {
      if (Date.now() >= decoded.exp * 1000) {
        console.log("expired");
        return next(req);
      } else {
      }
      console.log(Date.now());
    }
    return next(authReq);
  }
  return next(req);
};

/*
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // except for /login endpoint
    if (request.url.includes("/login")) {
      return next.handle(request);
    }
    // edit request
    request = request.clone({
      // bring token from sessionStorage and add as header
      setHeaders: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    });
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: any) => {
          // handle response
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return false;
            }
            console.warn("Session expired. Please login again.", "danger");
            sessionStorage.removeItem("token");
            this.router.navigate(["login"]);
          }
        }
      )
    );
  }
}
*/
