import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Input() value;
  @Input() label="Enter"
  @Input() placeHolder = "";
  @Input() type = "text";
  @Input() disabled = false;
  @Input() required = false;


  @Output() valueChange = new EventEmitter();
  

  ngOnInit(): void {
    this.value = this.value ? this.value : "";
  }

  updateInputValue() {
    this.valueChange.emit(this.value);
  }
}

