import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "../api.service";
import { LoginHandlerService } from "./login.handler.service";

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.service.logOauth();
    this.toastr.success("yep yep yep", "Login Successful");

    this.route.queryParamMap.subscribe((params) => {
      const jwtToken = params.get("token");
      if (jwtToken != null) {
        console.log("valid token");

        this.loginHandler.handle(jwtToken);
        /*localStorage.setItem("jwt", jwtToken);

        this.actions$
          .pipe(
            ofType(loadAstresSuccess),
            take(1) // auto-unsubscribe
          )
          .subscribe(() => {
            this.router.navigate(["/grid"]);
          });*/
      }
    });
    // Listen before trigerring the dispatch
    //this.store.dispatch(loadAstres());
  }
}
