import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-info-dialog",
  template: `
    <div class="modal-header">
      <h5 class="modal-title">-- Informations --</h5>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="close()"
      ></button>
    </div>

    <div class="modal-body" [innerHTML]="message">
      {{ message }}
    </div>

    <div class="modal-footer">
      <button class="btn btn-primary" (click)="close()">Ok</button>
    </div>
  `,
})
export class InfoDialogComponent {
  @Input() message = "Are you sure?";

  constructor(public activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }
}
