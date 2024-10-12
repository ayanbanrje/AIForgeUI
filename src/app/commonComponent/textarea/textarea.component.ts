import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss'
})
export class TextareaComponent {
  @Input() value;
  @Input() label="Enter"
  @Input() placeHolder = "";
  @Input() type = "text";
  @Input() disabled = false;


  @Output() valueChange = new EventEmitter();
  

  ngOnInit(): void {
    this.value = this.value ? this.value : "";
  }

  updateInputValue() {
    this.valueChange.emit(this.value);
  }
}
