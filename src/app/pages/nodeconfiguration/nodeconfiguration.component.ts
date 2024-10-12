import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NodeConfigurationService } from "../../services/backend/node-configuration.service";
import { MessageService } from "../../services/message.service";
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-nodeconfiguration',
  templateUrl: './nodeconfiguration.component.html',
  styleUrl: './nodeconfiguration.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NodeconfigurationComponent implements OnInit {
  activeTab = 'custom-source';
  nodes: Array<any> = [];

  moreOptionDropdownList = [
    {
      name: "On Boarding",
      icon: "boschicon-bosch-ic-welcome iconeSize",
      hasDropdown: false,
    },
    {
      name: "Language",
      icon: "boschicon-bosch-ic-chat-language iconeSize",
      hasDropdown: true,
    },
  ];

  setItem = '';
  showAddEditNodePopup = false;
  addEditNodeData = {
    'node_id': '',
    'node_name': '',
    'ram': '',
    'tags': '',
    'vcpus': '',
    'ssds': '',
    'gpus': ''
  }

  formLabel = '';
  submitBtnLabel = '';
  subTitle = '';

  updateFlag = false;
  rootPage = true;
  selectedNodeId = '';

  constructor(
    private nodeConfigurationService: NodeConfigurationService,
    private message: MessageService,
    private toast: ToastService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.node_list();
  }

  async node_list() {

    let node_list = await this.nodeConfigurationService.getNodeList({
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "startIndex": 0,
      "numberOfItems": 5
    });

    if (node_list.status == "success") {
      this.nodes = node_list.data;
    }

    /*let node_list = [
      {
        name: 'Node 1',
        node_id: '0001',
        vCPUs: 24,
        RAM_GB: '96GB',
        SSD_GB: '24',
        GPUs: '0001',
        numPipelines: '0001',
        numContainers: 1,
        status: 'Online',
        tags: ['CPU', 'GPU']
      },
      {
        name: 'Node 2',
        node_id: '0002',
        vCPUs: 24,
        RAM_GB: '96GB',
        SSD_GB: '24',
        GPUs: '0001',
        numPipelines: '0001',
        numContainers: 1,
        status: 'Online',
        tags: ['CPU', 'GPU']
      },
      {
        name: 'Node 3',
        node_id: '0003',
        vCPUs: 24,
        RAM_GB: '96GB',
        SSD_GB: '24',
        GPUs: '0001',
        numPipelines: '0001',
        numContainers: 1,
        status: 'Offline',
        tags: ['CPU', 'GPU']
      },
      {
        name: 'Node 4',
        node_id: '0004',
        vCPUs: 24,
        RAM_GB: '96GB',
        SSD_GB: '24',
        GPUs: '0001',
        numPipelines: '0001',
        numContainers: 1,
        status: 'Online',
        tags: ['CPU', 'GPU']
      },
      {
        name: 'Node 5',
        node_id: '0005',
        vCPUs: 24,
        RAM_GB: '96GB',
        SSD_GB: '24',
        GPUs: '0001',
        numPipelines: '0001',
        numContainers: 1,
        status: 'Offline',
        tags: ['CPU', 'GPU']
      },
      {
        name: 'Node 6',
        node_id: '0006',
        vCPUs: 24,
        RAM_GB: '96GB',
        SSD_GB: '24',
        GPUs: '0001',
        numPipelines: '0001',
        numContainers: 1,
        status: 'Offline',
        tags: ['CPU', 'GPU']
      }
    ];
    for (let singleObj of node_list) {
      this.nodes.push(singleObj)
    }*/
  }

  async create_node() {
    this.formLabel = 'Create New';
    this.submitBtnLabel = 'Create';
    this.subTitle = 'Enter details to create new node';
    await this.close_add_edit_node_popup();
    this.showAddEditNodePopup = true;
  }

  view_node_details(nodeId) {
    //console.log("159", nodeId)
    //this.router.navigate(['/nodedetails/' + nodeId])
    this.selectedNodeId = nodeId;
    this.rootPage = false;
  }

  functionCall(name) {
    alert(name)
  }
  closePopup(nodeId) {
    this.setItem = '';
  }

  openPopup(nodeId) {
    this.setItem = nodeId;
  }

  deleteNode(nodeId) {
    this.message.createMessage({
      header: "Confirm Delete",
      message: "Are you sure you want to delete the node?",
      isConfirm: true,
      yes: {
        label: "Yes",
        action: async () => {
          await this.deleteNodeById(nodeId);
        },
      },
      no: {
        label: "No",
        action: () => {
          this.message.close();
        },
      },
    });
  }

  async deleteNodeById(nodeId) {
    let response = await this.nodeConfigurationService.deleteNode({
      "node_id": nodeId
    });

    if (response && response.message != "") {
      this.toast.createToast({
        type: "success",
        message: response.message,
      });
    }
    await this.node_list();
  }

  async close_add_edit_node_popup() {
    Object.keys(this.addEditNodeData).forEach(key => {
      this.addEditNodeData[key] = '';  // Set value to blank
    });
    this.showAddEditNodePopup = false;
    this.updateFlag = false;
  }

  async add_node_data() {
    let response;
    if (this.updateFlag === true) {
      response = await this.nodeConfigurationService.updatenode({
        "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
        "node_id": this.addEditNodeData.node_id,
        "name": this.addEditNodeData.node_name,
        "vCPUs": parseInt(this.addEditNodeData.vcpus),
        "RAM_GB": parseInt(this.addEditNodeData.ram),
        "GPUs": parseInt(this.addEditNodeData.gpus),
        "SSD_GB": parseInt(this.addEditNodeData.ssds),
        "tags": [this.addEditNodeData.tags]
      });

      if (response && response.status == "success") {
        this.toast.createToast({
          type: "success",
          message: "Node updated successfully!!",
        });
      }
    } else {
      response = await this.nodeConfigurationService.createnodes({
        "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
        "name": this.addEditNodeData.node_name,
        "vCPUs": parseInt(this.addEditNodeData.vcpus),
        "RAM_GB": parseInt(this.addEditNodeData.ram),
        "GPUs": parseInt(this.addEditNodeData.gpus),
        "SSD_GB": parseInt(this.addEditNodeData.ssds),
        "numContainers": 0,
        "numPipelines": 1,
        "tags": [this.addEditNodeData.tags],
        "status": "Offline"
      });

      if (response && response.status == "success") {
        this.toast.createToast({
          type: "success",
          message: "Node created successfully!!",
        });
      }
    }

    await this.close_add_edit_node_popup();
    await this.node_list();
  }
  async edit_node(nodeId) {
    this.updateFlag = true;
    this.formLabel = 'Update';
    this.submitBtnLabel = 'Update';
    this.subTitle = 'Modify details to update node';
    let response = await this.nodeConfigurationService.getnodes({
      "node_id": nodeId
    });

    if (response && response.status == "success") {
      this.addEditNodeData = {
        "node_id": response.data[0].node_id,
        "node_name": response.data[0].name,
        "vcpus": response.data[0].vCPUs,
        "ram": response.data[0].RAM_GB,
        "gpus": response.data[0].GPUs,
        "ssds": response.data[0].SSD_GB,
        "tags": response.data[0].tags[0]
      }
      this.showAddEditNodePopup = true;
    }

  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
