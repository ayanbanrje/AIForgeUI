import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() fileName: File | null = null; // Use File type instead of an empty object
  @Output() fileNameChange = new EventEmitter<File | null>(); // Emit File type
  @Input() acceptedFileTypes: string = ''; 
  
  @ViewChild('fileInput') fileInput: any;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log("file", file);
    
    if (file) {
      this.fileName = file; // Update fileName with the File object
      this.fileNameChange.emit(this.fileName); // Emit the new file name to the parent
    } else {
      this.fileName = null; // Reset if no file is selected
      this.fileNameChange.emit(this.fileName); // Emit null if no file is selected
    }
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click(); // Trigger file input click event
  }
}
