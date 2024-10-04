import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit, OnChanges {
  @Input() list: Array<any>;
  @Input() display = 'inline';
  @Input() value;
  @Output() valueChange = new EventEmitter();
  

  ngOnInit() {
    this.loadDefaults();

  }

  ngOnChanges() {
    this.loadDefaults();
  }

  loadDefaults() {
    this.list.forEach(l => {
      if (l.key === this.value) {
        l.selected = true;
      }
    });
  }

  toggle(item) {
    if (this.list && this.list.length) {
      this.list.map(l => l.selected = false);
      item.selected = true;
    }
    this.value = this.list.find(l => l.selected);
    this.valueChange.emit(this.value);
  }

}
