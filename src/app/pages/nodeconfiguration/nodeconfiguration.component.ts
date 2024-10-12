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

  constructor(
    private nodeConfigurationService: NodeConfigurationService,
    private message: MessageService,
    private toast: ToastService
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

  create_node() {
    alert("Open Create Node Popup")
  }

  view_node_details(nodeId) {
    alert(nodeId + " view details clicked")
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
}
