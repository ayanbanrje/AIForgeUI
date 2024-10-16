import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit ,OnChanges{
  @Input() headers: string[] = [];
  @Input() rows: any[] = [];
  @Input() showCheckbox: boolean = false
  @Input() multipleCheckBoxAllowed: boolean = true
  @Output() rowSelected = new EventEmitter<any>();

  selectedRowValue: false

  ngOnInit(): void {
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.showCheckbox) {
      this.rows.map(item => {
        item.checkbox = false
      })
    }
  }

  onCheckboxChange(selecteRow: any, event: any) {
    if (!this.multipleCheckBoxAllowed) {
      this.rows.map(item => {
        if (!(item['_id'] === selecteRow['_id'])) {
          item.checkbox = false

        }
      })
      this.rowSelected.emit(selecteRow)
    }else{
      let emitSelectedRow=this.rows.filter((item)=>{
        if( item.checkbox==true){
          return item
        }
      })
      console.log("hello",emitSelectedRow)
      this.rowSelected.emit(emitSelectedRow)
    }
    
  }
} 
