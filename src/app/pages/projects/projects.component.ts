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
    { name: 'Template 4', description: 'Template 4 description' },
    { name: 'Template 5', description: 'Template 5 description' },
    { name: 'Template 6', description: 'Template 6 description' },
    { name: 'Template 7', description: 'Template 7 description' },
    { name: 'Template 8', description: 'Template 8 description' }
  ];
}
