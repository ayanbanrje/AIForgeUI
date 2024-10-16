import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tag-display',
  templateUrl: './tag-display.component.html',
  styleUrl: './tag-display.component.scss'
})
export class TagDisplayComponent {
  @Input() Tags=[]
  openAllTagsModal:boolean=false
  @Input() modalHeader=''
  openModal(){
    this.openAllTagsModal=true
  }
  cancelModal(){
    this.openAllTagsModal=false
  }
}
