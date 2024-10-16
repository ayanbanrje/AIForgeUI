import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit, OnChanges {
  @Input() headers: string[] = [];
  @Input() rows: any[] = [];
  @Input() showCheckbox: boolean = false
  @Input() multipleCheckBoxAllowed: boolean = false
  @Output() rowSelected = new EventEmitter<any>();

  selectedRowValue: false

  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {

    //whenever a table component is rendered the values of checkbox and '_id' is initialized
    let i = 0
    if (this.showCheckbox) {
      this.rows.map(item => {
        item.checkbox = false
        item['_id'] = i++
      })
    }
  }

  onCheckboxChange(selecteRow: any, event: any) {
    let emitSelectedRow = []
    if (!this.multipleCheckBoxAllowed) {
      this.rows.map(item => {
        if (!(item['_id'] === selecteRow['_id'])) {
          item.checkbox = false
        }
      })
      if (event) {
        emitSelectedRow = selecteRow
      }
      this.rowSelected.emit(emitSelectedRow)
    } else {
      emitSelectedRow = this.rows.filter((item) => {
        if (item.checkbox == true) {
          return item
        }
      })
      this.rowSelected.emit(emitSelectedRow)
    }

  }
} 
