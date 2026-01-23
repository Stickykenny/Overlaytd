import { Component, inject, OnInit } from "@angular/core";
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { SharedModule } from "src/app/shared.module";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { PageInfoService } from "src/app/page-info.service";
import { ApiService } from "src/app/api.service";
import { take } from "rxjs";
import { Astre } from "src/app/models/Astre";
import { offlineDb } from "src/app/db/offlineDb";
import { DragDropModule } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-tags-manager",
  imports: [DragDropModule, CdkDropList, CdkDrag, SharedModule],
  templateUrl: "./tags-manager.component.html",
  styleUrl: "./tags-manager.component.css",
})
export class TagsManagerComponent implements OnInit {
  astres: Astre[] = [];
  default = [];

  tagsDistribution = new Map<string, Astre[]>();
  tagsKeys: string[] = [];

  doneList: string[][] = [];

  constructor(
    // API service is injected using inject() (Angular 14+), to be safe use constructor injection for external service
    private toastr: ToastrService,
    private modalService: NgbModal,
    private pageInfoService: PageInfoService,
    private astreService: ApiService,
  ) {}

  ngOnInit(): void {
    this.astreService
      .getAstres()
      .pipe(take(1))
      .subscribe({
        next: (astres) => {
          this.astres = astres;
          this.updateTarget(["public", "private", "personnal"]);
          this.tagsKeys = Array.from(this.tagsDistribution.keys()).sort();
          this.tagsKeys.forEach(() => this.doneList.push([]));
        },
        error: (err) => {
          console.log("init err");
        },
        complete: () => {},
      });
  }

  /**
   * Will distribute the data depending on the tags
   * Current implementation is for exclusive tags
   */
  updateTarget(tags: string[]) {
    this.tagsDistribution = new Map<string, Astre[]>();
    tags.forEach((tag) => {
      this.tagsDistribution.set(tag, []);
    });
    this.tagsDistribution.set("", []);
    this.astres.forEach((astre) => {
      this.categorizeAstre(astre, tags);
    });
  }

  categorizeAstre(astre: Astre, tagsCategory: string[]) {
    let astreTags = (astre.tags || "").split(",");
    for (let tagRef of tagsCategory) {
      if (astreTags.includes(tagRef)) {
        this.tagsDistribution.get(tagRef)!.push(astre);
        return;
      }
    }
    this.tagsDistribution.get("")!.push(astre);
  }

  getConnectedLists(tag: string) {
    return this.tagsKeys.filter((tagKey) => tagKey != tag);
  }

  drop(event: CdkDragDrop<Astre[] | undefined>) {
    if (!event.container.data || !event.previousContainer.data) {
      return;
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      // Update tag
      let astre = event.container.data[event.currentIndex];
      let updatedTags = astre.tags.split(",").filter((tag) => tag != event.previousContainer.id);
      updatedTags.push(event.container.id);

      astre.tags = updatedTags.join(",");
      this.astreService
        .postAstres([astre])
        .pipe(take(1))
        .subscribe({
          next: (response) => {},
          error: (err) => {
            this.toastr.error("Error Updating tag");
            transferArrayItem(
              event.container.data!,
              event.previousContainer.data!,
              event.previousIndex,
              event.currentIndex,
            );
          },
        });
    }
  }
}
