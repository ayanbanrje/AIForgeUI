import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls: ["./checkbox.component.scss"],
})
export class CheckboxComponent {
  @Input() value;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter();
  @Input() repoCheck = false;
  @Input() label: string;
  @Input() isFromAnalysis = false;
  @Input() analysis = false;
  @Input() customClass = false;
  @Input() multiTree = false;
  @Input() alertForm = false;
  @Input() cursor='pointer'

  toggle() {
    if (!this.disabled) {
      this.value = !this.value;
      this.valueChange.emit(this.value);
    }
  }

  test($event) {
    console.log($event)
  }
}
