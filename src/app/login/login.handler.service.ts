import { Injectable } from "@angular/core";
import { Actions, ofType } from "@ngrx/effects";
import { loadAstres, loadAstresSuccess } from "../store/astre.actions";
import { take } from "rxjs";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { ApiService } from "../api.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class LoginHandlerService {
  constructor(
    private router: Router,
    private service: ApiService,
    private toastr: ToastrService,
    private store: Store,
    private actions$: Actions
  ) {}
  handle(jwtKey: string) {
    localStorage.setItem("jwt", jwtKey);
    this.service.logged();

    this.actions$.pipe(ofType(loadAstresSuccess), take(1)).subscribe(() => {
      this.router
        .navigate(["/grid"])
        .then(() => this.toastr.success("yep yep yep", "Login Successful"));
    });

    this.store.dispatch(loadAstres());
  }
}
