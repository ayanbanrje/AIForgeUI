// file-upload.component.ts
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() fileName={};
  @Output() fileNameChange = new EventEmitter<object>();


  @ViewChild('fileInput') fileInput: any;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log("file",file)
    if (file) {
      this.fileName = file; // Update fileName locally
      this.fileNameChange.emit(this.fileName); // Emit the new file name to the parent
    }
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click(); // Trigger file input click event
  }
}
