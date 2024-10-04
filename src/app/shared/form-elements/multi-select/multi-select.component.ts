import { Component, forwardRef, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
})
export class MultiSelectComponent implements OnInit {

  @Input() options: { name: string, value: string }[] = [];
  @Input() selected: string[] = [];
  @Output() selectionChange = new EventEmitter<string[]>();
  @Input() disabled = false;

  // selected: string[] = [];

  ngOnInit() {
    // No longer needed
  }
  toggleSelection(value: string): void {
    if(!this.disabled){
      const index = this.selected.indexOf(value);

    if (index === -1) {
      this.selected.push(value);
    } else {
      this.selected.splice(index, 1);
    }

    this.selectionChange.emit(this.selected);
    }
  }
  
}