import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "src/app/api.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-home",
  imports: [CommonModule],
  template: `
    <p></p>
    <pre>{{ details | json }}</pre>
  `,
  styles: ``,
})
/**
 * This is not safe to show as it contains private information
 */
export class HomeComponent implements OnInit {
  details: any;

  constructor(private service: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    console.log("Fetching data");
    this.service.getUserDetails().subscribe({
      next: (res) => {
        this.details = res;
      },
    });
  }
}
