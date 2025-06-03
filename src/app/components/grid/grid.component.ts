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
import { Astre } from "../../models/Astre";
import { ApiService } from "src/app/api.service";
import { RowModel, RowModelTransfer } from "src/app/models/RowModel";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-grid",
  standalone: true,
  imports: [CommonModule, AgGridAngular], //CommonModule required for ngFor
  templateUrl: "./grid.component.html",
})
export class GridComponent implements OnInit {
  // Row Data: The data to be displayed.
  count = 1;

  themes = [{ label: "themeQuartz", theme: themeAlpine }];
  theme = themeAlpine;

  title = "Ag Grid";
  rowData: RowModel[] = [];
  astre2Service: ApiService = inject(ApiService);

  gridOptions: GridOptions = {
    autoSizeStrategy: {
      type: "fitCellContents",
    },
  };
  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
    editable: true,
    filter: "agTextColumnFilter",
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
  };
  colDefs = [
    { headerName: "Type", field: "type" },
    { headerName: "Name", field: "name" },
    { headerName: "Tags", field: "tags" },
    {
      headerName: "Description",
      field: "description",
      maxWidth: 500,
    },
    { headerName: "Parent", field: "parent" },
    {
      headerName: "Date added",
      field: "date_added",
      editable: false,
      hide: true,
    },
    {
      headerName: "Last Modified",
      field: "last_modified",
      editable: false,
      hide: true,
    },
  ];

  ngOnInit() {}
  constructor(private service: ApiService, private toastr: ToastrService) {}
  private gridApi!: GridApi;
  onGridReady(evt: GridReadyEvent) {
    this.gridApi = evt.api;
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
        this.toastr.success(
          "Fetched a total of " + simplified.length + " rows",
          "Get Astres Successful"
        );

        this.rowData = simplified;
      },
      error: (err) => {
        console.error("Error loading data", err);
        this.toastr.error(err, "Error loading data");
      },
    });
  }

  async SendData() {
    console.log("SEND button!");

    const astres: Astre[] = [];
    const rowDatatmp: any[] = [];

    this.gridApi.forEachNode(function (node) {
      rowDatatmp.push(node.data);
    });

    rowDatatmp.forEach((item) => {
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
      next: (res) => {
        this.toastr.success(
          "A total of " + astres.length + " rows where sent",
          "Successful Update of data"
        );
      },
      error: (err) => {
        console.error("Error sending data", err);
        this.toastr.error(err, "Error sending data");
      },
    });
  }

  AddItems(type: string, tags: string, parent: string) {
    const newItems = [
      {
        type: type ? type : "type" + this.count,
        name: "name" + this.count,
        tags: tags,
        description: "",
        parent: parent,
      },
    ];
    this.gridApi.applyTransaction({
      add: newItems,
      addIndex: 0,
    }); //  it is a list of Row Nodes that were added, not row data
    this.count++;
  }
}
