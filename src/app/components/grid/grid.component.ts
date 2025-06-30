import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  themeAlpine,
  RowSelectionOptions,
  GetRowIdFunc,
  IRowNode,
} from "ag-grid-community";
import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AgGridAngular } from "ag-grid-angular";
import { Astre } from "../../models/Astre";
import { ApiService } from "src/app/api.service";
import { RowModel, RowModelTransfer } from "src/app/models/RowModel";
import { ToastrService } from "ngx-toastr";
import { FormsModule } from "@angular/forms";
import * as Papa from "papaparse";

@Component({
  selector: "app-grid",
  standalone: true,
  imports: [CommonModule, AgGridAngular, FormsModule], //CommonModule required for ngFor
  templateUrl: "./grid.component.html",
})
export class GridComponent implements OnInit {
  // Row Data: The data to be displayed.
  count: number = 1;

  themes = [{ label: "themeQuartz", theme: themeAlpine }];
  theme = themeAlpine;

  title: string = "Ag Grid";
  rowData: RowModel[] = [];
  astre2Service: ApiService = inject(ApiService);

  searchTerm: string = "";
  columnSearch = "";

  newItems: RowModel = {
    type: "type",
    name: "name",
    tags: "nidnf",
    description: "",
    parent: "dfsf",
    last_modified: "dfsf",
    date_added: "dfsf",
  };
  userKeys = Object.keys(this.newItems) as (keyof RowModel)[];
  selectedKey = "";

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
  rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };
  colDefs = [
    {
      headerName: "Type",
      field: "type",
      getQuickFilterText: (params: any) => {
        return params.value;
      },
    },
    {
      headerName: "Name",
      field: "name",
      getQuickFilterText: (params: any) => {
        return params.value;
      },
    },
    {
      headerName: "Tags",
      field: "tags",
      getQuickFilterText: (params: any) => {
        return params.value;
      },
    },
    {
      headerName: "Description",
      field: "description",
      maxWidth: 500,
      getQuickFilterText: (params: any) => {
        return params.value;
      },
    },
    {
      headerName: "Parent",
      field: "parent",
      getQuickFilterText: (params: any) => {
        return params.value;
      },
    },
    {
      headerName: "Date added",
      field: "date_added",
      editable: false,
      hide: true,
      getQuickFilterText: (params: any) => {
        return params.value;
      },
    },
    {
      headerName: "Last Modified",
      field: "last_modified",
      editable: false,
      hide: true,
      getQuickFilterText: (params: any) => {
        return params.value;
      },
    },
  ];

  ngOnInit() {}

  constructor(private service: ApiService, private toastr: ToastrService) {}

  private gridApi!: GridApi;

  onGridReady(evt: GridReadyEvent) {
    this.gridApi = evt.api;
  }

  /**
   * Quick Search in grid, can also filter put a specific column to search
   */
  onFilterTextBoxChanged(columnSearch: string): void {
    this.columnSearch = columnSearch;
    this.searchTerm = (
      document.getElementById("filter-text-box") as HTMLInputElement
    ).value;

    this.colDefs.forEach((colDef) => {
      colDef.getQuickFilterText = (params: any) => {
        return params.value;
      };
      if (columnSearch) {
        if (colDef.field != columnSearch) {
          colDef.getQuickFilterText = (params: any) => {
            return "";
          };
        }
      }
    });
    this.gridApi!.setGridOption("columnDefs", this.colDefs);
    this.gridApi.setGridOption("quickFilterText", this.searchTerm);
  }

  async retrieveData() {
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

  async sendData() {
    console.log("SEND button!");

    if (!this.verifyIntegrity()) {
      return;
    }

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
          "A total of " + astres.length + " rows were sent",
          "Successful Update of data"
        );
      },
      error: (err) => {
        console.error("Error sending data", err);
        this.toastr.error(err, "Error sending data");
      },
    });
  }

  addItems(type: string, tags: string, parent: string) {
    const newItems: RowModel[] = [
      {
        type: type ? type : "type" + this.count,
        name: "name" + this.count,
        tags: tags,
        description: "",
        parent: parent,
        last_modified: "",
        date_added: "",
      },
    ];
    this.gridApi.applyTransaction({
      add: newItems,
      addIndex: 0,
    }); //  it is a list of Row Nodes that were added, not row data
    this.count++;
  }

  deleteSelected() {
    const selectedData = this.gridApi.getSelectedNodes();
    console.log(selectedData);
    var count: number = 0;

    selectedData.forEach((node) => {
      if (this.service.deleteAstre(node.data.type, node.data.name)) {
        this.gridApi.applyTransaction({
          remove: [selectedData[count].data],
        });
        count++;
      }
    });
    this.toastr.success(
      "A total of " + count + " rows were removed",
      "Successful deletion of data"
    );
  }

  /**
   *
   * @returns If the rowNodes respect the data integrity
   */
  verifyIntegrity(): boolean {
    const duplicates: Set<String> = new Set();
    const map = new Map<string, boolean>();

    this.gridApi.forEachNode(function (node: IRowNode) {
      var id: string = node.data.type + "-" + node.data.name;
      if (!map.has(id)) {
        map.set(id, true);
      } else {
        duplicates.add(id);
      }
    });

    if (duplicates.size == 0) {
      this.toastr.success("A", "No duplicates found");
      return true;
    }
    this.toastr.error(
      "Found these as duplicates : " + Array.from(duplicates).join("|"),
      "Duplicate found",
      { disableTimeOut: true }
    );
    return false;
  }

  importData(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      /*Papa.parse(file, {
        header: false,
        complete: function (results) {
          console.log(results);
        },
      });*/

      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e: any) => {
        const csvText = e.target.result;
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,

          complete: (result) => {
            const simplified: any[] = result.data;
            const trs: RowModelTransfer[] = simplified.map((line: any) => ({
              type: line["Type"] || "",
              name: line["Name"] || "",
              tags: line["Tags"] || "",
              description: line["Description"] || "",
              parent: line["Parent"] || "",
              date_added: line["Date added"] || "",
              last_modified: line["Last Modified"] || "",
            }));
            this.rowData = trs;
          },
        });
      };
    }
  }

  exportData() {
    var colDefsFields: string[] = [];
    this.colDefs.forEach((col) => colDefsFields.push(col.field));
    this.gridApi!.exportDataAsCsv({
      allColumns: true,
      skipColumnHeaders: false,
      fileName:
        "exportGridData_" +
        new Date().toISOString().slice(0, 10).replace(/-/g, "") +
        ".csv", //
      columnKeys: colDefsFields,
      suppressQuotes: false,
    });
  }
}
