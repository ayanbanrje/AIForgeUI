import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child-module-extension',
  templateUrl: './child-module-extension.component.html',
  styleUrl: './child-module-extension.component.scss'
})
export class ChildModuleExtensionComponent {
  @Input() content: { heading: string, title:string,data: any[] } = { heading: '', title:'', data: [] };
  parentValue: string = ''; // Value that will be updated

  openCreateCustomModal:boolean=false;
  createCustom={
    name:'',
    inherited_from:'',
    description:'',
    file_name:''
  }
  constructor(){
  }
  funcOpenCreateCustomModal(){
    this.openCreateCustomModal=true
  }
  FuncCreateCustomModalClose(){
    this.openCreateCustomModal=false
  }
}
