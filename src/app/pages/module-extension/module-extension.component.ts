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
      "labels":['a','b']
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
      "labels":['a','b']
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
      "labels":['a','b']
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
      "labels":['a','b']
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
      "labels":['a','b']
    }
  ]
  constructor(
    private moduleExtensionService: ModuleExtensionService
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
    let params = {
      user_id: "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      asset_type: asset_type,
      startIndex: 0,
      numberOfItems: 5
    }

    // this.contentData = await this.moduleExtensionService.ListAvailableCustomComponents(params)
    console.log("this.contentData->>>>>>>>>", this.contentData)
  }
  async SaveModal() {
    console.log("items", this.createCustom)
    let body = {
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "asset_name": "Hello 2",
      "asset_type": "source",
      "description": "Test asset hello description",
      "parent_asset_name": "A",
      "parent_userid": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87"
    }
    const result = await this.moduleExtensionService.createCustomComponent(body)
    console.log("result->>>>>>>>>>>>>>>>>>>>", result)
  }

}

