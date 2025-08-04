import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  themeAlpine,
  RowSelectionOptions,
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
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmDialogComponent } from "src/app/confirm-dialog/confirm-dialog.component";

import { Store } from "@ngrx/store";
import * as AstreActions from "../../store/astre.actions";
import {
  selectAddAstreResult,
  selectAstres,
} from "src/app/store/astre.selectors";
import { filter, Observable, take } from "rxjs";
import { ActionStatus } from "src/app/store/action.state";

@Component({
  selector: "app-grid",
  standalone: true,
  imports: [CommonModule, AgGridAngular, FormsModule], //CommonModule required for ngFor
  templateUrl: "./grid.component.html",
  styleUrl: "./grid.component.css",
})
export class GridComponent implements OnInit {
  public allAstres$: Observable<Astre[]> = this.store.select(selectAstres);
  public addAstreResult$: Observable<ActionStatus> =
    this.store.select(selectAddAstreResult);

  // Row Data: The data to be displayed.
  count: number = 1;
  separator: string = "¤";
  themes = [
    {
      label: "themeQuartz",
      theme: themeAlpine,
    },
  ];
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

  defaultColDef: ColDef = {
    flex: 1,
    //minWidth: 150,
    editable: true,
    filter: "agTextColumnFilter",
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
    cellStyle: {
      "align-items": "center",
      display: "flex",
      "justify-content": "center",
    },
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
      }, // Why not in the default settings if applied to all ? I need rewrite this option each one separately
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
      //minWidth: 400,
      getQuickFilterText: (params: any) => {
        return params.value;
      },
      wrapText: true,
      autoHeight: true,
      cellEditor: "agLargeTextCellEditor",
      cellStyle: {
        "padding-top": "1px",
        "padding-bottom": "1px",
      },
      cellRenderer: (params: any) => {
        // Fool AG grid to render cell value as html
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
      hide: true,
    },
    {
      headerName: "Last Modified",
      field: "last_modified",
      hide: true,
    },
    {
      headerName: "Was Modified ?",
      field: "was_modified",
      //width: 30,
      hide: false,
    },
  ];

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch(AstreActions.loadAstres());

    if (this.rowData.length == 0) {
      this.retrieveData();
    }
  }

  private gridApi!: GridApi;

  gridOptions: GridOptions = {
    autoSizeStrategy: {
      //type: "fitCellContents",
      type: "fitGridWidth",
    },

    getRowId(params) {
      return params.data.name;
    },
    onCellValueChanged(event) {
      let data = event.data;
      // Can't update when the rowID is being changed
      if (event.column.getColId() != "name") {
        if (event.column.getColId() != "was_modified") {
          let rowNode = event.api.getRowNode(data.name)!;
          if (rowNode) {
            rowNode.setDataValue("was_modified", true);
          }
        }
      }
    },
  };

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
    /*this.service.getAstres()*/ this.allAstres$.pipe(take(1)).subscribe({
      next: (res) => {
        const simplified: RowModelTransfer[] = res.map((item) => ({
          ...item,
          ...item.astreID,
          was_modified: false,
        }));

        simplified.forEach((astre) => {
          delete astre.astreID;
        });
        this.importCheck(simplified, true);
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
    const rowDatatmp: RowModelTransfer[] = [];

    this.gridApi.forEachNode(function (node: IRowNode) {
      if (node.data.was_modified == true || node.isSelected()) {
        let item = node.data;
        astres.push({
          astreID: { type: item.type, name: item.name },
          tags: item.tags,
          description: item.description,
          parent: item.parent,
          date_added: item.date_added,
          last_modified: item.last_modified,
        });
      }
    });

    /*this.service
      .postAstres(astres)*/
    this.store.dispatch(AstreActions.addAstres({ newastres: astres }));

    this.addAstreResult$
      .pipe(
        filter((status) => status !== ActionStatus.PENDING),
        take(1)
      )
      .subscribe({
        next: (actionStatus) => {
          switch (actionStatus) {
            case ActionStatus.SUCCESS:
              this.gridApi.forEachNode((node: IRowNode) => {
                if (node.data.was_modified == true) {
                  // Reset the was_modified attribute
                  this.gridApi.getRowNode(node.data.name)!;
                  node.setDataValue("was_modified", false);
                  node.setSelected(false);
                }
              });
              this.toastr.success(
                "A total of " + astres.length + " rows were sent",
                "Successful Update of data"
              );
              break;
            default:
              this.toastr.error("Error sending data");
              break;
          }
        },
        error: (err) => {
          this.toastr.error(err, "Observable Error sending data");
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
        was_modified: true,
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
    var count: number = 0;
    /*.subscribe({
        next: (response) => {
          console.log("Entry deleted!", response);
          return true;
        },
        error: (err) => {
          console.error("Delete failed", err);
          return false;
        },
      });*/
    selectedData.forEach((node) => {
      /*this.service.deleteAstre(node.data.type, node.data.name).*/
      this.store.dispatch(
        AstreActions.deleteAstres({
          astreID: {
            type: node.data.type,
            name: node.data.name,
          },
        })
      );
      console.log("Entry deleted!", node.data.type, " - ", node.data.name);
      this.gridApi.applyTransaction({
        remove: [selectedData[count].data],
      });
      count += 1;
      /*subscribe({
        next: (response) => {
          console.log("Entry deleted!", node.data.type, " - ", node.data.name);
          this.gridApi.applyTransaction({
            remove: [selectedData[count].data],
          });
        },
        error: (err) => {
          console.error("Delete failed", err);
          return false;
        },
      });*/
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
      this.toastr.success("", "No duplicates found");
      return true;
    }
    this.toastr.error(
      "Found these as duplicates : " + Array.from(duplicates).join("|"),
      "Duplicate found",
      { disableTimeOut: true }
    );
    return false;
  }

  /**
   * Before importing, ask if the data should overwrite/append/ or be cancelled
   *
   *
   */
  importCheck(newData: RowModelTransfer[], force_overwrite?: boolean) {
    if (this.rowData.length == 0) {
      this.rowData = newData;
    } else {
      const modalRef = this.modalService.open(ConfirmDialogComponent, {
        centered: true,
      });
      modalRef.componentInstance.message =
        "There was already data present. Do you wish to overwrite them ? (YES : overwrite | NO : append)";

      modalRef.result
        .then((result) => {
          console.log("User chose:", result);
          if (result === "yes" || force_overwrite) {
            this.rowData = newData;
            this.toastr.success(
              "Imported a total of " + newData.length + " rows",
              "Import Successful"
            );
          } else if (result === "no") {
            this.rowData = newData.concat(this.rowData);
            this.toastr.success(
              "Appended a total of " + newData.length + " rows",
              "Import Successful"
            );
          } else {
            this.toastr.info("", "Import Cancelled");
          }
        })
        .catch(() => {
          console.log("Modal dismissed");
          this.toastr.info("", "Import Cancelled");
        });
    }
  }

  importData(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
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
              was_modified: false,
            }));
            this.importCheck(trs);
          },
        });
      };
    }
  }

  exportData() {
    console.log(this.allAstres$);
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

  test() {
    this.allAstres$.subscribe((a) => console.log(a));
  }
}
