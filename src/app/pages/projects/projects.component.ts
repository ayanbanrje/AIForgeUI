import { Component } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  templates = [
    { name: 'Template 1', description: 'Template 1 description' },
    { name: 'Template 2', description: 'Template 2 description' },
    { name: 'Template 3', description: 'Template 3 description' },
    { name: 'Template 4', description: 'Template 4 description' }
  ];
}
