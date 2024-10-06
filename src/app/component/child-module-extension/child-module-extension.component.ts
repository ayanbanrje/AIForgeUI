import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child-module-extension',
  templateUrl: './child-module-extension.component.html',
  styleUrl: './child-module-extension.component.scss'
})
export class ChildModuleExtensionComponent {
  @Input() content: { heading: string, title:string,data: any[] } = { heading: '', title:'', data: [] };
}
