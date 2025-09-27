import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "src/app/shared.module";
import { CdkDrag } from "@angular/cdk/drag-drop";
import { environment } from "src/environments/environment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
  selector: "app-media-dock",
  standalone: true,
  imports: [SharedModule, CdkDrag],
  template: `
    <div class="position-relative" style="z-index: 9999;" cdkDrag>
      <div
        class="position-absolute top-0 end-0 text-center bg-info bg-gradient p-2 rounded-3"
      >
        <div *ngIf="isExpanded; then thenBlock; else elseBlock"></div>
        <ng-template #thenBlock>
          <pre>Media Docker</pre>
          <button
            type="button"
            class="btn position-absolute top-0 end-0"
            (click)="onToggleMedia(false)"
          >
            <i class="bi bi-arrows-angle-expand"></i>
          </button>
        </ng-template>

        <ng-template #elseBlock>
          <pre>Media Docker       </pre>
          <button
            type="button"
            class="btn position-absolute top-0 end-0"
            (click)="onToggleMedia(true)"
          >
            <i class="bi bi-arrows-collapse"></i>
          </button>
        </ng-template>
        <div id="media-content">
          <br />
          <iframe
            height="240"
            width="480"
            [src]="iframeYtSource"
            loading="lazy"
            frameborder="1"
            allowfullscreen
            allow="autoplay"
          ></iframe>
        </div>
      </div>
    </div>
  `,
})
export class MediaDockComponent implements OnInit {
  isExpanded: boolean = true;
  YtPlaylistId: string;
  iframeYtSource: SafeResourceUrl;
  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer
  ) {
    this.YtPlaylistId = environment.mediaDockerPlaylistDefault + "&autoplay=1";
    this.iframeYtSource = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.YtPlaylistId
    );
  }

  ngOnInit() {}

  onToggleMedia(state: boolean) {
    this.isExpanded = state;
    const mediaContent = document.getElementById("media-content")?.style;
    if (!mediaContent) {
      return;
    }

    if (this.isExpanded) {
      mediaContent.display = "block";
    } else {
      mediaContent.display = "none";
    }
  }
}
