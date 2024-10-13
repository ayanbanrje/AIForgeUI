import { Component, OnInit } from '@angular/core';
import { ModuleExtensionService } from '../../services/backend/module-extension.service';

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
    file_name: ''
  }
  contentData=[]
  constructor(
    private moduleExtensionService: ModuleExtensionService
  ) {
  };
  ngOnInit(): void {
    this.ListAvailableCustomComponents('source')
  }
  setActiveTab(tab: string,asset_type_params) {
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
    let params = {
      user_id: "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      asset_type: asset_type,
      startIndex: 0,
      numberOfItems: 5
    }

    this.contentData = await this.moduleExtensionService.ListAvailableCustomComponents(params)
    console.log("this.contentData->>>>>>>>>", this.contentData)
  }
  async SaveModal(){
    console.log("items",this.createCustom)
    let body={
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "asset_name": "Hello 2",
      "asset_type": "source",
      "description": "Test asset hello description",
      "parent_asset_name": "A",
      "parent_userid": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87"
  }
    const result=await this.moduleExtensionService.createCustomComponent(body)
    console.log("result->>>>>>>>>>>>>>>>>>>>",result)
  }

}

