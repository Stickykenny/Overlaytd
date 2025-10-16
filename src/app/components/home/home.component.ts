import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "src/app/api.service";
import { ToastrService } from "ngx-toastr";
import { PageInfoService } from "src/app/page-info.service";
import { PAGE_DESCRIPTIONS } from "src/app/shared/page-descriptions";

@Component({
  selector: "app-home",
  imports: [CommonModule],
  template: `
    <div class="content-warning">
      <div class="title">
        Below informations <br />
        are not meant to be shared
      </div>
    </div>
    <p></p>
    @defer (on viewport) { Now showing..
    <pre>{{ details | json }}</pre>
    <!-- pre is mandatory here -->
    } @placeholder {
    <p>Details Informations here will be loading</p>
    } @loading (minimum 7s) {
    <p>Mandatory 7 sec wait before it's too late</p>
    } @error {
    <p>Failed to load details.</p>
    }
  `,
  styleUrl: "home.component.css",
})
/**
 * This is not safe to show as it contains private information
 */
export class HomeComponent implements OnInit {
  details: any;

  constructor(
    private service: ApiService,
    private toastr: ToastrService,

    private pageInfoService: PageInfoService
  ) {}

  ngOnInit() {
    this.pageInfoService.updateInformation(PAGE_DESCRIPTIONS.home);
    console.log("Fetching data");
    this.service.getUserDetails().subscribe({
      next: (res) => {
        this.details = res;
      },
    });
  }
}
