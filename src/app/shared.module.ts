import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule],
  exports: [CommonModule, FormsModule, NgForm], // Making them available
})
export class SharedModule {}
