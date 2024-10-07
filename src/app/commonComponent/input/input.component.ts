import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Output() inputValueChange = new EventEmitter<string>();

  // When input value changes, emit the value to the parent
  onInputChange(value: string) {
    this.inputValueChange.emit(value);
  }
}

