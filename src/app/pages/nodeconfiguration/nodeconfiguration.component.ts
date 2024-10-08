import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NodeConfigurationService } from "../../../app/services/backend/node-configuration.service";

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
    private nodeConfigurationService: NodeConfigurationService
  ) {
  }

  ngOnInit() {
    this.node_list();
  }

  node_list() {

    // let node_list = this.nodeConfigurationService.getNodeList({
    //   "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
    //   "startIndex": 0,
    //   "numberOfItems": 5
    // })
    // console.log("node_list", node_list)

    //if (node_list === "undefined") {

    //}
    let node_list = [
      {
        name: 'Node 1',
        id: '0001',
        vcpus: 24,
        ram: '96GB',
        ssd: '24',
        gpus: '0001',
        pipeline: '0001',
        containers: 1,
        status: 'Online'
      },
      {
        name: 'Node 2',
        id: '0002',
        vcpus: 24,
        ram: '96GB',
        ssd: '24',
        gpus: '0001',
        pipeline: '0001',
        containers: 1,
        status: 'Online'
      },
      {
        name: 'Node 3',
        id: '0003',
        vcpus: 24,
        ram: '96GB',
        ssd: '24',
        gpus: '0001',
        pipeline: '0001',
        containers: 1,
        status: 'Offline'
      },
      {
        name: 'Node 4',
        id: '0004',
        vcpus: 24,
        ram: '96GB',
        ssd: '24',
        gpus: '0001',
        pipeline: '0001',
        containers: 1,
        status: 'Online'
      },
      {
        name: 'Node 5',
        id: '0005',
        vcpus: 24,
        ram: '96GB',
        ssd: '24',
        gpus: '0001',
        pipeline: '0001',
        containers: 1,
        status: 'Offline'
      },
      {
        name: 'Node 6',
        id: '0006',
        vcpus: 24,
        ram: '96GB',
        ssd: '24',
        gpus: '0001',
        pipeline: '0001',
        containers: 1,
        status: 'Offline'
      }
    ];
    for (let singleObj of node_list) {
      this.nodes.push(singleObj)
    }
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
}
