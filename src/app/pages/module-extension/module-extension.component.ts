import { Component, OnInit } from '@angular/core';
import { ModuleExtensionService } from '../../services/backend/module-extension.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-module-extension',
  templateUrl: './module-extension.component.html',
  styleUrl: './module-extension.component.scss'
})
export class ModuleExtensionComponent implements OnInit {
  activeTab = 'Custom Source'; // Default tab
  openCreateCustomModal: boolean = false;
  createCustom = {
    name: '',
    inherited_from: '',
    description: '',
    file_name: null,
    asset_id: ''
  }
  contentData = [

  ]
  original_contentData = [

  ]
  searchQuery
  inherited_from = {
    dropdownList: ["a", "b", "c", "d"],
    selectedItems: [],
  }
  asset_type = "source"
  constructor(
    private moduleExtensionService: ModuleExtensionService,
    private toast: ToastService
  ) {
  };
  ngOnInit(): void {
    this.ListAvailableCustomComponents('source')
  }
  setActiveTab(tab: string, asset_type_params) {

    this.activeTab = tab;
    this.ListAvailableCustomComponents(asset_type_params)
  }
  funcOpenCreateCustomModal() {
    this.clearCustomForm()
    this.openCreateCustomModal = true
  }
  FuncCreateCustomModalClose() {
    this.openCreateCustomModal = false
  }
  async ListAvailableCustomComponents(asset_type) {
    this.searchQuery = ''
    this.asset_type = asset_type
    this.contentData = []
    let params = {
      user_id: "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      asset_type: asset_type,
      startIndex: 0,
      numberOfItems: 5
    }

    let result = await this.moduleExtensionService.ListAvailableCustomComponents(params)
    this.contentData = result.data
    this.original_contentData = this.contentData
  }
  async SaveModal() {
    console.log("this.createCustom", this.createCustom)
    console.log("this.content", this.contentData)
    if (!this.validateFields()) return;
    let body = {
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "asset_name": this.createCustom.name,
      "asset_type": this.asset_type,
      "description": this.createCustom.description,
      "parent_asset_name": "A",
      "parent_userid": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87"
    }

    const result = await this.moduleExtensionService.createCustomComponent(body)
    console.log("crea",result.data)
    if (result) {
      this.downloadZipFile(result.data[0].zip_file)
      this.createCustom.asset_id = result.data[0].asset_id
    }

  }
  dropDownValueChanged(event) {
    this.createCustom.inherited_from = event;
  }
  validateFields(): boolean {
    const { name, inherited_from, description, file_name } = this.createCustom;
    if (!name) return this.showToastError("Please enter the name");
    if (!description) return this.showToastError("Please enter the description");
    return true;
  }

  showToastError(message: string): boolean {
    this.toast.createToast({ type: "error", message });
    return false;
  }
  async deleteAsset(asset_id) {
    let body = {
      "asset_id": asset_id,
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87"
    }
    let response = await this.moduleExtensionService.deleteCustomComponent(body)
    if (response.data.message == "Component successfully deleted") {
      this.toast.createToast({
        type: "success",
        message: "Assets deleted Successfully !!"
      })
    }
    this.ListAvailableCustomComponents(this.asset_type)
  }

  async onFileSelected(file: File | null) {
    this.createCustom.file_name = file;

    if (file) {
      console.log("file",file)
      const formData = new FormData();
      formData.append('uploaded_file', file);
      formData.append('asset_name', this.createCustom.name);
      formData.append('asset_type', this.asset_type);
      formData.append('asset_id', this.createCustom.asset_id);
      formData.append('user_id', "54a226b9-8ea6-4370-b0b0-c256b2ab8f87");
      let result = await this.moduleExtensionService.uploadasset(formData)
      if(result){
        this.ListAvailableCustomComponents(this.asset_type)
        this.FuncCreateCustomModalClose()
        this.toast.createToast({
          type:"success",
          message:`${this.activeTab} Uploaded Successfully`
        })
      }
    }
  }
  downloadZipFile(zip_file) {
    const base64String = zip_file;
    const byteCharacters = atob(base64String);

    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/zip' });

    // Create a link element
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'downloaded_file.zip';

    // Append the link to the DOM and trigger the download
    document.body.appendChild(link);
    link.click();

    // Remove the link from the DOM
    document.body.removeChild(link);
  }

  onSearch(event) {
    this.contentData = this.original_contentData.filter(item => {
      const searchTerm = event.toLowerCase();
      const nameMatch = item.asset_name?.toLowerCase().includes(searchTerm) || false;
      const descriptionMatch = item.description?.toLowerCase().includes(searchTerm) || false;
      return nameMatch || descriptionMatch;
    });


  }
  clearCustomForm(){
    this.createCustom= {
      name: '',
      inherited_from: '',
      description: '',
      file_name: null,
      asset_id: ''
    }
  }
}

