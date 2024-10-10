import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NodeConfigurationService } from "../../../app/services/backend/node-configuration.service";
import { MessageService } from "../../../app/services/message.service";

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
    private message: MessageService
  ) {
  }

  ngOnInit() {
    this.node_list();
  }

  node_list() {

    let node_list = this.nodeConfigurationService.getNodeList({
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "startIndex": 0,
      "numberOfItems": 5
    }).subscribe({
      next: (node_list) => {
        this.nodes = node_list.data;  // Assign the result to the nodes array       
      },
      error: (error) => {
        console.error("Error fetching node list", error);
      }
    });

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
    console.log("Delete button clicked for node:", nodeId);
    this.message.createMessage({
      header: "Confirm Delete",
      message: "Are you sure you want to delete the node?",
      isConfirm: true,
      yes: {
        label: "Yes",
        action: () => {
          this.deleteNodeById(nodeId);
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

  deleteNodeById(nodeId) {
    alert("API Call will be implemented!!")
  }
}
