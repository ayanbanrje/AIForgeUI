import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrl: './datasets.component.scss'
})
export class DatasetsComponent implements OnInit{
  datasets = [
    {
      'DataSet Name': 'Data Input',
      'Description': 'Configure data sources for your pipeline. Easily connect to various data inputs for seamless integration.',
      'Format': 'csv',
      'Date Modified': '2024-05-10',
      'Size': '20MB',
      'Tags': ['Source', 'Source', 'Source', '+2']
    },
    {
      'DataSet Name': 'Preprocess',
      'Description': 'Customize data preprocessing steps to clean and transform your dataset, ensuring it’s model-ready.',
      'Format': 'png',
      'Date Modified': '2024-05-12',
      'Size': '25MB',
      'Tags': ['Source', 'Source', 'Source', '+3']
    },
    {
      'DataSet Name': 'Train Model',
      'Description': 'Set parameters and manage resources to efficiently train your machine learning models.',
      'Format': 'jpg',
      'Date Modified': '2024-05-13',
      'Size': '30MB',
      'Tags': ['Source', 'Source', 'Source', '+2']
    },
    {
      'DataSet Name': 'Evaluate Model',
      'Description': 'Assess model performance with customizable evaluation metrics and validation techniques.',
      'Format': 'txt',
      'Date Modified': '2024-05-14',
      'Size': '15MB',
      'Tags': ['Source', 'Source', 'Source', '+2']
    },
    {
      'DataSet Name': 'Evaluate Model',
      'Description': 'Assess model performance with customizable evaluation metrics and validation techniques.',
      'Format': 'txt',
      'Date Modified': '2024-05-14',
      'Size': '15MB',
      'Tags': ['Source', 'Source', 'Source', '+2']
    }
  ];

  tableHeaders = [
    'DataSet Name', 'Description', 'Format', 'Date Modified', 'Size', 'Tags'
  ];
  itemsPerPage: number = 3; // Adjust based on how many items you want per page
  currentPage: number = 1;
  paginatedDatasets: any[] = [];

  ngOnInit(): void {
    this.updatePaginatedData();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedDatasets = this.datasets.slice(start, end);
  }
  onSearch(query: string) {
    console.log('Search query:', query);
    // Handle search logic here

  }

}
