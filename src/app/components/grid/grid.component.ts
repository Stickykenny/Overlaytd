import {
  ColDef,
  ColGroupDef,
  GridApi,
  GridOptions,
  ModuleRegistry,
  createGrid,
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

@Component({
  selector: "app-grid",
  standalone: true,
  imports: [CommonModule, AgGridAngular, FormsModule], //CommonModule required for ngFor
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
  getRowId: GetRowIdFunc = (params: any) =>
    params.data.type + "-" + params.data.name;

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
  onFilterTextBoxChanged(columnSearch: string) {
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

  AddItems(type: string, tags: string, parent: string) {
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
}
