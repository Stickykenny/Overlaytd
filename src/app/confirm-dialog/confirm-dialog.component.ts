import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-confirm-dialog",
  template: `
    <div class="modal-header">
      <h5 class="modal-title">Confirmation</h5>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="handleChoice('cancel')"
      ></button>
    </div>

    <div class="modal-body">
      {{ message }}
    </div>

    <div class="modal-footer">
      <button class="btn btn-primary" (click)="handleChoice('yes')">Yes</button>
      <button class="btn btn-warning" (click)="handleChoice('no')">No</button>
      <button class="btn btn-secondary" (click)="handleChoice('cancel')">
        Cancel
      </button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  @Input() message = "Are you sure?";

  constructor(public activeModal: NgbActiveModal) {}

  handleChoice(choice: "yes" | "no" | "cancel") {
    this.activeModal.close(choice);
  }
}
