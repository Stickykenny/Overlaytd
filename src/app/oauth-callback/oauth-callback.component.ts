import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { ApiService } from "../api.service";

@Component({
  selector: "app-oauth-callback",
  imports: [CommonModule, FormsModule],
  template: ` <p>oauth-callback works!</p> `,
  styles: ``,
})
export class OauthCallbackComponent implements OnInit {
  constructor(
    private service: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    router.events.subscribe((val) => {
      // see also
      //console.log("instance of nav end");
      //console.log(val instanceof NavigationEnd);
    });
  }

  ngOnInit(): void {
    this.service.logOauth();
    this.toastr.success("yep yep yep", "Login Successful");
    this.route.queryParamMap.subscribe((params) => {
      const jwtToken = params.get("token");
      if (jwtToken != null) {
        console.log("valid token");
        localStorage.setItem("jwt", jwtToken);
      }
    });
    this.router.navigate(["/grid"]);
  }
}
