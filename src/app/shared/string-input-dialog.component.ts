import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../shared.module";

@Component({
  selector: "app-confirm-dialog",
  imports: [SharedModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">Confirmation</h5>
      <button type="button" class="btn-close" aria-label="Close" (click)="cancel()"></button>
    </div>

    <div class="modal-body" style="white-space: pre-line;">
      {{ message }}
    </div>

    <div class="modal-body"><input type="text" [(ngModel)]="userInput" /></div>

    <div class="modal-footer">
      <button class="btn btn-primary" (click)="submit()">Yes</button>
      <button class="btn btn-secondary" (click)="cancel()">Cancel</button>
    </div>
  `,
})
export class StringInputDialogComponent {
  @Input() message = "Are you sure?";

  userInput: string = "public";

  constructor(public activeModal: NgbActiveModal) {}

  cancel() {
    this.activeModal.close("");
  }
  submit() {
    this.activeModal.close(this.userInput);
  }
}
