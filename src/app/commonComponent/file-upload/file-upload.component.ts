import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() fileName: File | null = null; // Store the selected File object
  @Output() fileNameChange = new EventEmitter<File | null>(); // Emit the selected File object
  @Input() acceptedFileTypes: string = ''; 

  @ViewChild('fileInput') fileInput: any;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    
    if (file) {
      this.fileName = file; // Store the selected file
      this.fileNameChange.emit(this.fileName); // Emit the file to the parent component
    } else {
      this.fileName = null; // Reset if no file is selected
      this.fileNameChange.emit(this.fileName); // Emit null to the parent if no file
    }
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click(); // Trigger file input click event
  }
}
