import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "../api.service";
import { LoginHandlerService } from "./login.handler.service";
import { Action } from "@ngrx/store";
import { Actions, ofType } from "@ngrx/effects";
import { loadAstresSuccess } from "../store/astre.actions";
import { take } from "rxjs";

@Component({
  selector: "app-oauth-callback",
  imports: [CommonModule, FormsModule],
  template: ` <p>oauth-callback works!</p> `,
  styles: ``,
})
export class OauthCallbackComponent implements OnInit {
  constructor(
    private service: ApiService,
    private loginHandler: LoginHandlerService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private actions$: Actions,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.service.logOauth();
    this.toastr.success("yep yep yep", "Login Successful");

    this.route.queryParamMap.subscribe((params) => {
      this.loginHandler.handle();
      this.actions$
        .pipe(
          ofType(loadAstresSuccess),
          take(1) // auto-unsubscribe
        )
        .subscribe(() => {
          this.router.navigate(["/tree"]);
        });
    });
  }
}
