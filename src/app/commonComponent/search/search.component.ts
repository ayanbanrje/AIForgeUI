import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();

  
  ngOnInit(): void {
    this.value = this.value ? this.value : "";
  }
  onSearchButtonClicked() {
    this.valueChange.emit(this.value);
  }
  emitSearchValue() {
    this.valueChange.emit(this.value);
  }
}
