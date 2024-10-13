import { Component } from '@angular/core';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrl: './datasets.component.scss'
})
export class DatasetsComponent {
  onSearch(query: string) {
    console.log('Search query:', query);
    // Handle search logic here
  }
  
}
