// Angular 19

import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { TokenInterceptor } from "./token.interceptors";
import { provideRouter } from "@angular/router";
import routeConfig from "./routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routeConfig),
    provideHttpClient(withInterceptors([TokenInterceptor])),
  ],
};
