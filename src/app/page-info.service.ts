import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PageInfoService {
  private pageInformation: Subject<string> = new BehaviorSubject<string>(
    "No description found"
  );

  get pageInformation$() {
    return this.pageInformation.asObservable();
  }

  updateInformation(description: string) {
    this.pageInformation.next(description);
  }

  constructor() {}
}
