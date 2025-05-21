import {
  AllCommunityModule,
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  createGrid,
} from "ag-grid-community";
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgGridAngular } from "ag-grid-angular";

import { ClientSideRowModelModule } from "ag-grid-community";

ModuleRegistry.registerModules([ClientSideRowModelModule]); // it's a messy problem with ag grid 33+ version

import { Astre } from "../../models/Astre";
import { AstreService } from "../../services/astre.service";
import { ApiService } from "src/app/api.service";
import { RowModel } from "src/app/models/RowModel";

@Component({
  selector: "app-grid",
  standalone: true,
  imports: [CommonModule, AgGridAngular], //CommonModule required for ngFor
  templateUrl: "./grid.component.html",
})
export class GridComponent {
  // Row Data: The data to be displayed.
  rowData: RowModel[] = [];
  astreService: AstreService = inject(AstreService);
  astre2Service: ApiService = inject(ApiService);

  constructor(private service: ApiService) {}

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "type" },
    { field: "name" },
    { field: "tags" },
    { field: "description" },
    { field: "parent" },
    { field: "date_added" },
    { field: "last_modified" },
  ];

  ngOnInit() {}
  // Grid Options: Contains all of the grid configurations
  gridOptions: GridOptions<Astre> = {
    // Data to be displayed

    defaultColDef: {
      flex: 1,
    },
  };

  gridApi: GridApi;

  onGridReady(evt: any) {
    this.gridApi = evt.gridApi;
  }

  async RetrieveData() {
    console.log("Hello from the button!");
    this.service.getAstres().subscribe({
      next: (res) => {
        const simplified = res.map((item) => ({
          ...item,
          ...item.astreID,
          //astreID: undefined, // astreID is still present
        }));

        this.rowData = simplified;
      },
      error: (err) => {
        console.error("Error loading data", err);
      },
    });
  }
}
