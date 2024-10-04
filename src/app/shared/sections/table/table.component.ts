/**
 * @ Author: Ajay Sharma
 * @ Create Time: 2020 apr
 * @ Modified by: Your name
 * @ Modified time: 2020 may
 * @ Description: Customize Table Component
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from "@angular/core";
import { Clipboard } from "@angular/cdk/clipboard";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnInit, OnChanges {
  @Input() headers;
  @Input() noData = "No Data";
  @Input() view;
  @Output() klick = new EventEmitter();
  @Output() cellClick = new EventEmitter();
  @Input() reports = false;
  @Input() paginationLimit = 0;
  @Input() showPagination = true;
  @Input() filter: Object = {};
  @Input() multiSelect: boolean = false;
  @Input() requiredCheckBox: boolean = false;
  row: any = {};
  viewData: any = {};
  data;
  pageNumber = 1;
  pages = [];
  pageList = [
    { page: 10, checked: true },
    { page: 20 },
    { page: 30 },
    { page: 40 },
    { page: 50 },
  ];
  // noOfRows = 10;
  noOfRows = { page: 10, key: 10, view: 10, checked: true };
  @Input() defaults = "SELECT";
  @Output() iconklick = new EventEmitter();
  @Input() itemsPerPage = false;
  @Output() sendSelectedAppliance = new EventEmitter();
  @Output() mapAppliance = new EventEmitter();
  @Input() isCopied = false;
  @Input() applianceIdLink = false;
  @Input() padding = 0;
  lastSelectedRow = -1;
  multiSelectData = [];
  @Input() multiDeleteDone = false;
  @Input() isMultiDelete = false;
  @Output() deleteSignature = new EventEmitter();
  @Input() checkStatus = false;
  @Output() configurationClick = new EventEmitter();
  @Output() sendFilterHeaader = new EventEmitter();
  visibleTrue = false;
  @Input() selectedHeader = "";
  cutsomInputData = "";
  @Output() sendCutsomInputData = new EventEmitter();
  @Input() marginTop = "2.5rem";
  @Input() forceHide = false;

  constructor(private clipboard: Clipboard, private toast: ToastService) { }

  ngOnInit() {
    this.updatePagination(this.noOfRows);
    // this.load();
  }
  ngOnChanges() {
    if (this.multiDeleteDone === true) {
      this.multiSelectData = [];
      this.view.map((m) => {
        m.selected = false;
        return m;
      });
    }
    this.lastSelectedRow = parseInt(localStorage.getItem("lastSelectedRow"));
    if (
      !Number.isNaN(this.lastSelectedRow) &&
      JSON.parse(localStorage.getItem("cuurentSignature"))["APPLIANCE_NAME"]
        .length === 0
    ) {
      this.check(JSON.parse(localStorage.getItem("SELECTED SIGNATURE")));
    }
    this.updatePagination(this.noOfRows);
    // this.load();
  }
  load() {
    this.view = this.view.map((j) => {
      j["selected"] = false;
      return j;
    });

    if (Object.keys(this.filter).length > 0) {
      let filteredArray = [];
      for (let i of this.view) {
        let satisfy = true;
        for (let keyElam of Object.keys(this.filter)) {
          if (i[keyElam] != this.filter[keyElam]) {
            satisfy = false;
          }
        }
        if (satisfy == true) {
          filteredArray.push(i);
        }
      }
      this.view = filteredArray;
    }
    this.viewData = {
      data: this.view,
      rows: this.noOfRows.key,
      page: this.pageNumber,
    };
    this.data = this.pagination(
      this.viewData.data,
      this.viewData.page,
      this.viewData.rows
    );
  }

  pagination(data, page, rows) {
    this.pages = [];
    const pagess = Math.ceil(data?.length / rows);
    for (let i = 0; i < pagess; i++) {
      let paginationList = { pageNo: i + 1, active: !i };
      paginationList["visible"] =
        this.paginationLimit > 0 ? i < this.paginationLimit : true;
      this.pages.push(paginationList);
    }

    const trimStart = (page - 1) * rows;
    const trimEnd = trimStart + rows;
    const trimmedData = this.showPagination
      ? data.slice(trimStart, trimEnd)
      : data;
    return {
      data: trimmedData,
      pages: pagess,
    };
  }
  updatedData() {
    const trimStart = (this.viewData.page - 1) * this.viewData.rows;
    const trimEnd = trimStart + this.viewData.rows;
    const trimmedData = this.viewData.data.slice(trimStart, trimEnd);
    this.data.data = trimmedData;
  }
  updatePageNo(page?) {
    this.pages.forEach((f) => (f.active = false));
    page.active = true;
    this.viewData.page = page.pageNo;
    this.updatedData();
  }
  updateClickPageNo(action) {
    const page = this.pages.find((c) => c.active === true);
    const length = this.pages.length;
    // this.pages.forEach(f => f.active = false);
    if (action === "decrease" && page.pageNo !== 1) {
      this.pages.forEach((f) => (f.active = false));
      const pageNo = page.pageNo - 1;
      this.pages.find((c) => c.pageNo === pageNo).active = true;
      if (
        this.paginationLimit > 0 &&
        !this.pages.find((c) => c.pageNo === pageNo).visible
      ) {
        for (let i = 0; i < this.pages.length; i++) {
          if (i < pageNo && i >= pageNo - this.paginationLimit) {
            this.pages[i].visible = true;
          } else {
            this.pages[i].visible = false;
          }
        }
      }
      this.viewData.page = pageNo;
      this.updatedData();
    }
    if (action === "increase" && page.pageNo !== length) {
      this.pages.forEach((f) => (f.active = false));
      const pageNo = page.pageNo + 1;
      this.pages.find((c) => c.pageNo === pageNo).active = true;
      if (
        this.paginationLimit > 0 &&
        !this.pages.find((c) => c.pageNo === pageNo).visible
      ) {
        for (let i = 0; i < this.pages.length; i++) {
          if (i >= pageNo - 1 && i < pageNo + this.paginationLimit - 1) {
            this.pages[i].visible = true;
          } else {
            this.pages[i].visible = false;
          }
        }
      }
      this.viewData.page = pageNo;
      this.updatedData();
    }
  }
  updatePagination(items?) {
    this.noOfRows.key = items.key;
    this.load();
  }

  iconClick(row, header?) {
    this.row = row;
    if (header && header.label === "Action") {
      this.deleteSignature.emit(this.row);
    } else if (header && (header.label === "Configuration Info" || header.label === "Download")) {
      this.configurationClick.emit(this.row);
    } else {
      this.iconklick.emit(this.row);
    }
  }

  checked(rowcheck, row) {
    this.row = row;
    if (rowcheck) {
      this.view.map((d) => (d.selected = false));
      row.selected = true;
      this.klick.emit(this.row);
    } else {
      this.klick.emit({});
    }
  }

  multiChecked(rowcheck, row) {
    this.row = row;

    if (this.isMultiDelete === true) {
      if (rowcheck) {
        this.multiSelectData.push(row);
        row.selected = true;
        this.klick.emit(this.multiSelectData);
      } else {
        this.multiSelectData = this.multiSelectData.filter((f) => {
          if (f.APPLIANCE_ID !== row.APPLIANCE_ID) {
            return f;
          }
        });
        this.view.map((v) => {
          if (v.APPLIANCE_ID !== row.APPLIANCE_ID) {
            row.selected = false;
            return v;
          }
        });
        this.klick.emit(this.multiSelectData);
      }
    } else {
      if (rowcheck) {
        row.selected = true;
        this.klick.emit(this.row);
      } else {
        this.klick.emit({});
      }
    }
  }

  rowItemClick(event, row) {
    localStorage.setItem("cuurentSignature", JSON.stringify(row));
    if (event === "APPLIANCE_ID") {
      this.sendSelectedAppliance.emit(row);
    }
    if (
      row[event] != undefined &&
      row[event] != null &&
      row[event] != "" &&
      this.isCopied === true
    ) {
      this.clipboard.copy(row[event].toString());
      this.toast.createToast({
        type: "success",
        message: "Copied successfully!!!",
      });
    }
  }

  check(row, event?) {
    localStorage.setItem("cuurentSignature", JSON.stringify(row));
    if (this.checkStatus === false) {
      this.mapAppliance.emit(row);
    }
  }

  getTargetText(row) {
    let tagetText = "";
    if (Object.keys(row["TARGET"].length > 0)) {
      tagetText = `TARGET DETAILS
      TENANT_ID: ${row["TARGET"]["TENANT_ID"]}
      CLUSTER: ${row["TARGET"]["CLUSTER"]}
      COUNTRY: ${row["TARGET"]["COUNTRY"]}
      LOCATION: ${row["TARGET"]["LOCATION"]}
      STORE_ID: ${row["TARGET"]["STORE_ID"]}
      POI_ID: ${row["TARGET"]["POI_ID"]}
      DEVICE_ID: ${row["TARGET"]["DEVICE_ID"]}
      CATEGORY_ID: ${row["TARGET"]["CATEGORY_ID"]}
      APPLIANCE_ID: ${row["TARGET"]["APPLIANCE_ID"]}
      PHASE: ${row["TARGET"]["PHASE"]}
      `;
    } else {
      tagetText = "No Data";
    }
    return tagetText;
  }

  getTooltipContent(targetDetails: any) {
    // Build your tooltip content here dynamically
    let tooltipContent = "";
    for (const [key, value] of Object.entries(targetDetails)) {
      tooltipContent += `${key}: ${value}\n`;
    }
    return tooltipContent;
  }

  filterTable(header, selection?) {
    if (
      this.selectedHeader.length > 0 &&
      this.selectedHeader === header.label
    ) {
      if (this.visibleTrue) {
        this.visibleTrue = false;
      } else {
        this.visibleTrue = true;
      }
      if (this.selectedHeader.length > 0) {
        this.selectedHeader = "";
      } else {
        this.selectedHeader = header.label;
      }
    } else if (
      this.selectedHeader.length > 0 &&
      this.selectedHeader !== header.label
    ) {
      this.visibleTrue = true;
      this.selectedHeader = header.label;
    } else if (this.selectedHeader.length === 0) {
      this.selectedHeader = header.label;
    }

    if (selection) {
      this.sendFilterHeaader.emit([header, selection]);
    } else {
      this.sendFilterHeaader.emit([header]);
    }
  }

  searchData(header) {
    this.sendCutsomInputData.emit([header, this.cutsomInputData])
  }
}
