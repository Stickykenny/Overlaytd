import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "src/app/shared.module";
import { CdkDrag } from "@angular/cdk/drag-drop";
import { environment } from "src/environments/environment";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { BooleanDigit } from "src/app/utils/helper";

@Component({
  selector: "app-media-dock",
  standalone: true,
  imports: [SharedModule, CdkDrag],
  template: `
    <div
      id="media-docker"
      class="position-relative"
      style="z-index: 9999;"
      cdkDrag
    >
      <div
        class="position-absolute top-0 end-0 text-center bg-info bg-gradient p-2 rounded-3"
        style="max-width:500px"
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
          <pre>       Media Docker       </pre>
          <button
            type="button"
            class="btn position-absolute top-0 end-0"
            (click)="onToggleMedia(true)"
          >
            <i class="bi bi-arrows-collapse"></i>
          </button>
        </ng-template>
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              class="nav-link active"
              id="nav-tbd-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-tbd"
              type="button"
              role="tab"
              aria-controls="nav-tbd"
              aria-selected="false"
              (click)="forceOpenMedia()"
            >
              About this
            </button>
            <button
              class="nav-link"
              id="nav-playlist-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-playlist"
              type="button"
              role="tab"
              aria-controls="nav-playlist"
              aria-selected="true"
              (click)="forceOpenMedia()"
            >
              Youtube Playlist
            </button>
            <button
              class="nav-link"
              id="nav-rss-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-rss"
              type="button"
              role="tab"
              aria-controls="nav-rss"
              aria-selected="false"
              (click)="forceOpenMedia()"
            >
              RSS ?
            </button>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent" style="display:none">
          <div
            class="tab-pane fade show"
            id="nav-playlist"
            role="tabpanel"
            aria-labelledby="nav-playlist-tab"
          >
            <div id="media-content">
              This Web-application is not affiliated with any of the videos on
              this Youtube embed
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
          <div
            class="tab-pane fade"
            id="nav-rss"
            role="tabpanel"
            aria-labelledby="nav-rss-tab"
          >
            .....
          </div>
          <div
            class="tab-pane  active"
            id="nav-tbd"
            role="tabpanel"
            aria-labelledby="nav-tbd-tab"
          >
            This Web-application is a project for organizing life, knowledge.
            This version is a preview, a lot of server feature are not available
            on this static webpage. Author :
            <a href="https://github.com/Stickykenny">Github Link</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: "./media-dock.component.css",
})
export class MediaDockComponent implements OnInit {
  isExpanded: boolean = false;
  YtPlaylistId: string;
  iframeYtSource: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) {
    var autoplay: number = BooleanDigit.FALSE;
    let maxVid = 7;
    let rdmVidStart = "&index=" + Math.floor(Math.random() * maxVid);
    this.YtPlaylistId =
      environment.mediaDockerPlaylistDefault +
      "&autoplay=" +
      autoplay +
      rdmVidStart;
    this.iframeYtSource = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.YtPlaylistId
    );
  }

  ngOnInit() {}

  onToggleMedia(state: boolean) {
    this.isExpanded = state;
    const mediaContent = document.getElementById("nav-tabContent")?.style;
    if (!mediaContent) {
      return;
    }

    if (this.isExpanded) {
      mediaContent.display = "block";
    } else {
      mediaContent.display = "none";

      const tabContainer = document.getElementById("media-docker");
      if (!tabContainer) {
        return;
      }
      const buttons = tabContainer.querySelectorAll(".nav-link");
      console.log(buttons);
      buttons.forEach((btn) => btn.classList.remove("active"));
      console.log("All tabs deactivated");

      const tabContent = tabContainer.querySelectorAll(".tab-pane");
      tabContent.forEach((content) => content.classList.remove("active"));
    }
  }

  forceOpenMedia() {
    this.isExpanded = true;
    const mediaContent = document.getElementById("nav-tabContent")?.style;
    if (!mediaContent) {
      return;
    }
    mediaContent.display = "block";
  }
}
