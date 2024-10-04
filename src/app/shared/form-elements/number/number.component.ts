import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss']
})
export class NumberComponent implements OnInit , OnChanges {
  @Input() min = 0;
  @Input() max = 20;
  @Input() steps = 1;
  @Input() value = 0;
  @Input() usageHrs = false;
  @Output() valueChange = new EventEmitter();
  @Input() check = false;
  @Input() disabled = false;
  @Input() inputPadding ;
  @Input() inputBorderBottom;

  ngOnInit() {
    this.value = this.value ? this.value : 0;
    this.value = Number(this.value);
  }

  ngOnChanges() {
    this.value = Number(this.value);
  }

  increment() {
    if (this.value < this.max && this.disabled === false) {
    this.value += this.steps;
    this.valueChange.emit(this.value);
    }
  }
  
  decrement() {
    if (this.value > this.min && this.disabled === false) {
      this.value -= this.steps;
      this.valueChange.emit(this.value);
    }
  }

}
