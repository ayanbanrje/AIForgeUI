import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent {
  @Input() label = 'Enter';
  @Input() placeHolder = 'Enter tags';
  @Input() disabled = false;
  @Input() required = false;
  @Input() value: string[] = []; // Updated to handle array of tags

  @Output() valueChange = new EventEmitter<string[]>();

  inputValue = '';

  ngOnInit(): void {
    // Initialize tags array if it's undefined
    this.value = this.value ? this.value : [];
  }

  // Add tag to the array when pressing Enter
  addTag(): void {
    if (this.inputValue.trim()) {
      this.value.push(this.inputValue.trim());
      this.inputValue = '';
      this.valueChange.emit(this.value); // Emit updated array of tags
    }
  }

  // Remove a tag from the array
  removeTag(index: number): void {
    this.value.splice(index, 1);
    this.valueChange.emit(this.value);
  }

  updateInputValue() {
    this.valueChange.emit(this.value);
  }
}
