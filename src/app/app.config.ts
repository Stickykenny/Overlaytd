// Angular 19

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { TokenInterceptor } from "./token.interceptors";
import { provideRouter } from "@angular/router";
import routeConfig from "./routes";
import { provideToastr } from "ngx-toastr";
import { provideAnimations } from "@angular/platform-browser/animations";
import { StoreModule } from "@ngrx/store";
import { astreFeatureKey, AstreReducer } from "./store/astre.reducer";
import { AstreEffects } from "./store/astre.effects";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
//import { csrfInterceptor } from "./csrf.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routeConfig),
    provideHttpClient(
      withInterceptors([TokenInterceptor]), // First entry is the first run (left to right)
      withInterceptorsFromDi() // Run Class-based interceptor after // This is older implementation and require the line below
    ),
    //{ provide: HTTP_INTERCEPTORS, useClass: csrfInterceptor, multi: true }, // Older implementation of interceptors
    provideToastr({
      positionClass: "toast-bottom-right",
      progressBar: true,
      progressAnimation: "decreasing",
    }),
    provideAnimations(),

    importProvidersFrom(
      StoreModule.forFeature(astreFeatureKey, AstreReducer),
      StoreModule.forRoot({
        router: AstreReducer,
      }),
      StoreDevtoolsModule.instrument(),
      EffectsModule.forRoot([AstreEffects])
    ),
  ],
};
