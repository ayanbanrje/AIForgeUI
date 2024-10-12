import { Component, Input, Output, EventEmitter,ChangeDetectorRef  } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Input() header = '';
  @Input() view = false;
  @Input() width;
  @Input() styles;
  @Input() headerColor;
  @Output() viewChange = new EventEmitter();
  @Input() changePassword = false;
  @Input() installationDevice = false;
  @Input() zIndex = '9999';
  @Input() isMobileView= false;

  constructor(private cd: ChangeDetectorRef) {
    //console.log(this.s3)

    if(!this.styles){
      this.styles = { 'width': '70%', height : '500px'} 
    }
  }

  public close() {
    // document.querySelector('html').style.overflow = '';
    this.view = false;
    this.viewChange.emit(false);
    this.cd.markForCheck();
  }
}
