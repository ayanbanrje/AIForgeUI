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
    {
      "asset_id": "607cc87e-2d99-55c0-b209-4be0bfedc397",
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "asset_name": "new algo",
      "asset_type": "algo",
      "path": null,
      "description": "Test asset B",
      "attributes": null,
      "dependencies": [],
      "parent_user_id": null,
      "config_path": null,
      "access_type": 3,
      "labels": ['a', 'b']
    },
    {
      "asset_id": "328d3232-01c2-5eeb-8ab5-31049babde64",
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "asset_name": "file_algo3",
      "asset_type": "algo",
      "path": "19b4a38c-3cff-56e7-b634-08e7ac112681/algo/file_algo3.py",
      "description": "This is custom algo 3",
      "attributes": null,
      "dependencies": [],
      "parent_user_id": null,
      "config_path": null,
      "access_type": 3,
      "labels": ['a', 'b']
    },
    {
      "asset_id": "2d2a7546-ea1f-56c5-b596-274fd25f400e",
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "asset_name": "file_algo2",
      "asset_type": "algo",
      "path": "19b4a38c-3cff-56e7-b634-08e7ac112681/algo/file_algo2.py",
      "description": "This is custom algo 2",
      "attributes": null,
      "dependencies": [],
      "parent_user_id": null,
      "config_path": null,
      "access_type": 3,
      "labels": ['a', 'b']
    },
    {
      "asset_id": "5ce96cee-b349-5d33-b9a4-a86d18f44eaf",
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "asset_name": "file_algo",
      "asset_type": "algo",
      "path": "19b4a38c-3cff-56e7-b634-08e7ac112681/algo/file_algo.py",
      "description": "This is custom algo 1",
      "attributes": null,
      "dependencies": [],
      "parent_user_id": null,
      "config_path": null,
      "access_type": 3,
      "labels": ['a', 'b']
    },
    {
      "asset_id": "cc60139e-77fd-53a8-8883-3d55395c421b",
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "asset_name": "new",
      "asset_type": "algo",
      "path": null,
      "description": "Test asset B",
      "attributes": null,
      "dependencies": [],
      "parent_user_id": null,
      "config_path": null,
      "access_type": 3,
      "labels": ['a', 'b']
    }
  ]
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
    this.openCreateCustomModal = true
  }
  FuncCreateCustomModalClose() {
    this.openCreateCustomModal = false
  }
  async ListAvailableCustomComponents(asset_type) {
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
  }
  async SaveModal() {
    console.log("this.createCustom", this.createCustom)
    console.log("this.content", this.contentData)
    // if (!this.validateFields()) return;
    let body = {
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "asset_name": this.createCustom.name,
      "asset_type": this.asset_type,
      "description": this.createCustom.description,
      "parent_asset_name": "A",
      "parent_userid": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87"
    }

    let result = {
      "status": "success",
      "error_message": "",
      "data": [
        {
          "asset_id": "634cecd6-20b9-53b3-abf3-0685e3bac1f6",
          "zip_file": "UEsDBBQAAAAAALqKT1k31gz/0gAAANIAAAAGAAAAQV8xLnB5DQpmcm9tIGFsZ28uQiBpbXBvcnQgQg0KDQpkZWYgb3ZlcnJpZGUobWV0aG9kKToNCiAgICByZXR1cm4gbWV0aG9kDQoNCmNsYXNzIEFfMShCKToNCiAgICBAb3ZlcnJpZGUNCiAgICBkZWYgcnVuKHNlbGYsIEFpbj1Ob25lLCBBb3V0PU5vbmUsIGFyZ0NmZz1Ob25lKToNCiAgICAgICAgIyBVc2VyLWRlZmluZWQgbG9naWMgZm9yIEFfMQ0KICAgICAgICBwYXNzDQogICAgUEsDBBQAAAAAALqKT1nculrqtQAAALUAAAAJAAAAYWxnby9BLnB5DQpkZWYgb3ZlcnJpZGUobWV0aG9kKToNCiAgICByZXR1cm4gbWV0aG9kDQoNCmNsYXNzIEEoKToNCiAgICBAb3ZlcnJpZGUNCiAgICBkZWYgcnVuKHNlbGYsIEFpbj1Ob25lLCBBb3V0PU5vbmUsIGFyZ0NmZz1Ob25lKToNCiAgICAgICAgIyBVc2VyLWRlZmluZWQgbG9naWMgZm9yIEENCiAgICAgICAgcGFzcw0KICAgIFBLAwQUAAAAAAC6ik9ZRIzZZc4AAADOAAAACQAAAGFsZ28vQi5weQ0KZnJvbSBhbGdvLkEgaW1wb3J0IEENCg0KZGVmIG92ZXJyaWRlKG1ldGhvZCk6DQogICAgcmV0dXJuIG1ldGhvZA0KDQpjbGFzcyBCKEEpOg0KICAgIEBvdmVycmlkZQ0KICAgIGRlZiBydW4oc2VsZiwgQWluPU5vbmUsIEFvdXQ9Tm9uZSwgYXJnQ2ZnPU5vbmUpOg0KICAgICAgICAjIFVzZXItZGVmaW5lZCBsb2dpYyBmb3IgQg0KICAgICAgICBwYXNzDQogICAgUEsBAhQAFAAAAAAAuopPWTfWDP/SAAAA0gAAAAYAAAAAAAAAAAAAALaBAAAAAEFfMS5weVBLAQIUABQAAAAAALqKT1nculrqtQAAALUAAAAJAAAAAAAAAAAAAAC2gfYAAABhbGdvL0EucHlQSwECFAAUAAAAAAC6ik9ZRIzZZc4AAADOAAAACQAAAAAAAAAAAAAAtoHSAQAAYWxnby9CLnB5UEsFBgAAAAADAAMAogAAAMcCAAAAAA=="
        }
      ],
      "total_count": ""
    }
    this.downloadZipFile(result.data[0].zip_file)
    // const result = await this.moduleExtensionService.createCustomComponent(body)
    // console.log("result->>>>>>>>>>>>>>>>>>>>", result.data)
    // if(result){
    //   this.ListAvailableCustomComponents(this.asset_type);
    //   const current_asset=this.contentData.filter(item=>{
    //      return item.asset_name=this.createCustom.name
    //   })
    //   console.log("current_asset_id",current_asset['asset_id']);
    //   this.createCustom.asset_id=current_asset['asset_id']
    // }else{

    // }

    // await this.moduleExtensionService.downloadZip(body).subscribe((blob)=>{
    //   // Create a URL for the blob
    //   const url = window.URL.createObjectURL(blob);

    //   // Create an anchor element and trigger a download
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'downloaded.zip'; // Set the file name
    //   document.body.appendChild(a);
    //   a.click();

    //   // Clean up
    //   document.body.removeChild(a);
    //   window.URL.revokeObjectURL(url);

    //   this.ListAvailableCustomComponents(this.asset_type);
    //   const current_asset=this.contentData.filter(item=>{
    //      return item.asset_name=this.createCustom.name
    //   })
    //   console.log("current_asset_id",current_asset['asset_id']);
    //   this.createCustom.asset_id=current_asset['asset_id']
    // })
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
      // Call the API to upload the file once it's selected
      const formData = new FormData();
      formData.append('file', file);
      formData.append('asset_type', this.asset_type);
      formData.append('asset_id', this.createCustom.asset_id);
      formData.append('user_id', "54a226b9-8ea6-4370-b0b0-c256b2ab8f87");
      let result = await this.moduleExtensionService.uploadasset(formData)
      console.log("result upload", result)
    }
  }
  downloadZipFile(zip_file) {
    const base64String =zip_file;
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
}

