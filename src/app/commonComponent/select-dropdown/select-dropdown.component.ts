import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-select-dropdown',
  templateUrl: './select-dropdown.component.html',
  styleUrl: './select-dropdown.component.scss'
})
export class SelectDropdownComponent {

  @Input() multiSelect = true; 
  @Input() selectAllText = "Select All"; 
  @Input() unSelectAllText = "Deselect All"; 
  @Input() allowSearchFilter = true;
  @Input() placeHolder = 'Select Option';
  @Input() dropdownList = [];
  @Input() selectedItems = [];
  @Input() noDataAvailablePlaceholderText = 'No Data Available';
  @Output() valueChanged = new EventEmitter();

  //dropdownList: { item_id: number; item_text: string }[] = [];
  //selectedItems : { item_id: number; item_text: string }[] = [];
  
  dropdownSettings!: IDropdownSettings;
  itemChecked; 
  idField='item_id';
  textField='item_text';
  

  ngOnInit() {

    this.dropdownSettings = {
      singleSelection: !this.multiSelect,
      idField: this.idField,
      textField: this.textField,
      selectAllText: this.selectAllText,
      unSelectAllText: this.unSelectAllText,
      itemsShowLimit: 3,
      allowSearchFilter: this.allowSearchFilter,
      noDataAvailablePlaceholderText: this.noDataAvailablePlaceholderText
    }

    if(this.multiSelect){
      this.itemChecked = [];
      if(this.selectedItems.length > 0){
        this.itemChecked.push(...this.selectedItems)
      }
    }else{
      this.itemChecked = {}
      if(this.selectedItems.length > 0){
        this.itemChecked = this.selectedItems[0]
      }
    }
    
  }
  onItemSelect(item: any) {
    if(this.multiSelect){
      this.itemChecked.push(item)
    }else{
      this.itemChecked = item
    }
    
    this.valueChanged.emit(this.itemChecked)
  }
  onSelectAll(items: any) {
    this.itemChecked = items;
    this.valueChanged.emit(this.itemChecked)
  }

  onDeSelect(items: any){
    if(this.multiSelect){
      this.itemChecked = this.itemChecked.filter(i=>{
        return i[this.idField] != items[this.idField]
      })
    }
    this.valueChanged.emit(this.itemChecked)
  }

  onDeSelectAll(items: any){
    this.itemChecked = items;
    this.valueChanged.emit(this.itemChecked)
  }
}
