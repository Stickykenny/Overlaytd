// Angular 19

import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig } from "@angular/core";
import { TokenInterceptor } from "./token.interceptors";
import { provideRouter } from "@angular/router";
import routeConfig from "./routes";
import { provideToastr } from "ngx-toastr";
import { provideAnimations } from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routeConfig),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    provideToastr({
      positionClass: "toast-bottom-right",
      progressBar: true,
      progressAnimation: "decreasing",
    }),
    provideAnimations(),
  ],
};
