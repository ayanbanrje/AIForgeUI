import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child-module-extension',
  templateUrl: './child-module-extension.component.html',
  styleUrl: './child-module-extension.component.scss'
})
export class ChildModuleExtensionComponent {
  @Input() content: { heading: string, title:string,data: any[] } = { heading: '', title:'', data: [] };
  parentValue: string = ''; // Value that will be updated

  // Update the value when the child component emits the change
  updateValue(newValue: string) {
    this.parentValue = newValue;
    console.log("this.parentvalue",this.parentValue)
  }
}
