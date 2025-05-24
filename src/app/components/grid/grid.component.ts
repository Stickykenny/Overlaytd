import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  createGrid,
  GridReadyEvent,
  themeAlpine,
} from "ag-grid-community";
import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgGridAngular } from "ag-grid-angular";

//import { ClientSideRowModelModule } from "ag-grid-community";

//ModuleRegistry.registerModules([ClientSideRowModelModule]); // it's a messy problem with ag grid 33+ version

import { Astre } from "../../models/Astre";
import { ApiService } from "src/app/api.service";
import { RowModel, RowModelTransfer } from "src/app/models/RowModel";
import { compileDeferResolverFunction } from "@angular/compiler";

@Component({
  selector: "app-grid",
  standalone: true,
  imports: [CommonModule, AgGridAngular], //CommonModule required for ngFor
  templateUrl: "./grid.component.html",
})
export class GridComponent implements OnInit {
  // Row Data: The data to be displayed.
  themes = [{ label: "themeQuartz", theme: themeAlpine }];
  theme = themeAlpine;

  title = "Ag Grid";
  rowData: RowModel[] = [];
  astre2Service: ApiService = inject(ApiService);

  gridOptions: GridOptions;
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    editable: true,
    filter: "agTextColumnFilter",
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
  };
  colDefs = [
    { headerName: "Type", field: "type", editable: false },
    { headerName: "Name", field: "name", editable: false },
    { headerName: "Tags", field: "tags" },
    { headerName: "Description", field: "description" },
    { headerName: "Parent", field: "parent" },
    { headerName: "Date added", field: "date_added", editable: false },
    { headerName: "Last Modified", field: "last_modified", editable: false },
  ];
  ngOnInit() {}
  constructor(private service: ApiService) {}
  // Column Definitions: Defines the columns to be displayed.
  gridApi: GridApi;
  onGridReady(evt: any) {
    this.gridApi = evt.gridApi;
    this.RetrieveData();
  }

  async RetrieveData() {
    console.log("Fetching data");
    this.service.getAstres().subscribe({
      next: (res) => {
        // TODO move out this logics
        const simplified: RowModelTransfer[] = res.map((item) => ({
          ...item,
          ...item.astreID,
        }));

        simplified.forEach((astre) => {
          delete astre.astreID;
        });

        this.rowData = simplified;
      },
      error: (err) => {
        console.error("Error loading data", err);
      },
    });
  }
  async SendData() {
    console.log("SEND button!");
    console.log(this.rowData);

    const astres: Astre[] = [];

    this.rowData.forEach((item) => {
      astres.push({
        astreID: { type: item.type, name: item.name },
        tags: item.tags,
        description: item.description,
        parent: item.parent,
        date_added: item.date_added,
        last_modified: item.last_modified,
      });
    });
    console.log(astres);
    this.service.postAstres(astres).subscribe({
      next: (res) => {},
      error: (err) => {
        console.error("Error loading data", err);
      },
    });
  }
}
