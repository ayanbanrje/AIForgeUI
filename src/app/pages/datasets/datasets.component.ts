import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { DatasetsService } from '../../services/backend/datasets.service';
@Component({
  selector: 'app-datasets',
  templateUrl: './datasets.component.html',
  styleUrl: './datasets.component.scss'
})
export class DatasetsComponent implements OnInit {
  datasets = [
    {
      'DataSet Name': 'Data Input',
      'Description': 'Configure data sources for your pipeline. Easily connect to various data inputs for seamless integration.',
      'Format': 'csv',
      'Date Modified': '2024-05-10',
      'Size': '20MB',
      'Tags': ['Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source']
    },
    {
      'DataSet Name': 'Preprocess',
      'Description': 'Customize data preprocessing steps to clean and transform your dataset, ensuring it’s model-ready.',
      'Format': 'png',
      'Date Modified': '2024-05-12',
      'Size': '25MB',
      'Tags': ['Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source']
    },
    {
      'DataSet Name': 'Train Model',
      'Description': 'Set parameters and manage resources to efficiently train your machine learning models.',
      'Format': 'jpg',
      'Date Modified': '2024-05-13',
      'Size': '30MB',
      'Tags': ['Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source']
    },
    {
      'DataSet Name': 'Evaluate Model',
      'Description': 'Assess model performance with customizable evaluation metrics and validation techniques.',
      'Format': 'txt',
      'Date Modified': '2024-05-14',
      'Size': '15MB',
      'Tags': ['Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source']
    },
    {
      'DataSet Name': 'Evaluate Model',
      'Description': 'Assess model performance with customizable evaluation metrics and validation techniques.',
      'Format': 'txt',
      'Date Modified': '2024-05-14',
      'Size': '15MB',
      'Tags': ['Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source', 'Source']
    }
  ];

  tableHeaders = [
    'DataSet Name', 'Description', 'Format', 'Date Modified', 'Size', 'Tags'
  ];
  itemsPerPage: number = 3; // Adjust based on how many items you want per page
  currentPage: number = 1;
  paginatedDatasets: any[] = [];
  openAddNewDatasetsModal: boolean = false

  addNewDatasets = {
    name: '',
    description: '',
    file_name: null,
    tags: []
  }

  constructor(public toast: ToastService, public datasetsService: DatasetsService) {

  }
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

  funcOpenAddNewDatasetsModal() {
    this.clearAddNewDatasetsForm()
    this.openAddNewDatasetsModal = true
  }
  FuncCloseAddNewDatasetsModal() {
    this.openAddNewDatasetsModal = false
  }
  async SaveModal() {
    if (!this.validateFields()) return;
    const formData = new FormData();
    formData.append('user_id', '54a226b9-8ea6-4370-b0b0-c256b2ab8f87'); // Example user ID
    formData.append('asset_type', 'dataset'); // Example asset type
    formData.append('dataset', this.addNewDatasets.file_name); // Append the file to FormData
    formData.append('asset_name', this.addNewDatasets.name);
    formData.append('description', this.addNewDatasets.description);

    if (this.addNewDatasets.tags && this.addNewDatasets.tags.length > 0) {
      this.addNewDatasets.tags.forEach(tag => formData.append('tags[]', tag)); // 'tags[]' for multiple tags
    }

    const result = await this.datasetsService.createNewDataSets(formData)
    if (result) {
      this.FuncCloseAddNewDatasetsModal()
      this.toast.createToast({
        type: "success", message: 'Created New DataSet Successfully'
      })
    }
  }


  validateFields(): boolean {
    const { name, description, file_name, tags } = this.addNewDatasets;

    if (!name) return this.showToastError("Please enter the name");
    if (!description) return this.showToastError("Please enter the description");
    if (!tags || tags.length === 0) return this.showToastError("Please add at least one tag");
    if (!file_name || !file_name['name']) return this.showToastError("Please upload the file");
    if (file_name['name'] && !['application/zip', 'application/x-zip-compressed'].includes(file_name['type'])) {
      return this.showToastError("Please upload the zip file");
    }

    return true;
  }

  showToastError(message: string): boolean {
    this.toast.createToast({ type: "error", message });
    return false;
  }
  clearAddNewDatasetsForm() {
    this.addNewDatasets = {
      name: '',
      description: '',
      file_name: null,
      tags: []
    }
  }
}
