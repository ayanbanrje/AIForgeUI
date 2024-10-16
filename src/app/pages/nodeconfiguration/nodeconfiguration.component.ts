import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NodeConfigurationService } from "../../services/backend/node-configuration.service";
import { MessageService } from "../../services/message.service";
import { ToastService } from '../../services/toast.service';
import { ModuleExtensionService } from '../../services/backend/module-extension.service';

@Component({
  selector: 'app-nodeconfiguration',
  templateUrl: './nodeconfiguration.component.html',
  styleUrl: './nodeconfiguration.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NodeconfigurationComponent implements OnInit {
  activeTab = 'Pipeline';
  nodeDetailsSelectedSearchBarText = "Pipeline Running on Node";
  nodeDetailsSelectedSearchBarViewAllLinkText = "View all Pipelines";
  nodeDetailsActiveTabCreateNewBtnText = "Create New Pipeline";
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
  showAllList = false;
  selectedNodeId = '';
  selectedNodeDetails: any = {};
  contentData = []
  openCreateNewModal: boolean = false;
  showAllTagsFlag: boolean = false;
  allTags = [];
  whoseTag = '';

  tableHeaders = [
    'Description', 'Tags'
  ];
  itemsPerPage: number = 10; // Adjust based on how many items you want per page
  currentPage: number = 1;
  paginatedDatasets: any = [];
  datasets: any = [];

  constructor(
    private nodeConfigurationService: NodeConfigurationService,
    private message: MessageService,
    private toast: ToastService,
    private router: Router,
    private moduleExtensionService: ModuleExtensionService
  ) {
    this.tableHeaders.unshift(`${this.activeTab} Name`);
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
    this.showAllList = false;
    this.selectedNodeDetails = this.nodes.find(n => n.node_id == nodeId);
    this.setActiveTab(this.activeTab);

    console.log("node details", this.selectedNodeDetails)
  }

  back_to_listing() {
    this.selectedNodeId = '';
    this.rootPage = true;
    this.selectedNodeDetails = {};
    this.activeTab = 'Pipeline';
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
    }

    if (response && response.status == "success") {
      let fileLink = await this.download_node_file(response.data);
      let msg = '';
      if (fileLink) {
        msg = " File downloaded successfully!!";
      }
      if (this.updateFlag === true) {
        this.toast.createToast({
          type: "success",
          message: "Node updated successfully." + msg,
        });
      } else {
        this.toast.createToast({
          type: "success",
          message: "Node created successfully." + msg,
        });
      }

    }

    await this.close_add_edit_node_popup();
    await this.node_list();
  }

  async download_node_file(nodeId) {
    let ret: boolean = false;
    let response = await this.nodeConfigurationService.downloadcred({
      "execution_id": nodeId
    });

    /*let response = {
      "status": "success",
      "error_message": "",
      "data": [
        {
          "node_id": "12a226b9-8ea6-4370-b0b0-c256b2ab8f86",
          "certificates": {
            "deviceCert": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUV3RENDQXFpZ0F3SUJBZ0lFWnQ2aXBEQU5CZ2txaGtpRzl3MEJBUXNGQURBVk1STXdFUVlEVlFRRERBcGoKYkdsbGJuUmpaWEowTUI0WERUSTBNRGt3T1RBM01qUXlNRm9YRFRJMU1Ea3dPVEEzTWpReU1Gb3dMekV0TUNzRwpBMVVFQXd3a01USmhNakkyWWprdE9HVmhOaTAwTXpjd0xXSXdZakF0WXpJMU5tSXlZV0k0WmpnMk1JSUNJakFOCkJna3Foa2lHOXcwQkFRRUZBQU9DQWc4QU1JSUNDZ0tDQWdFQWxhdlpsWnZtZW5oK21SQS9uc1M3OU5pVkhLRkoKaEk3cGtuVzVjR0I1MjZQYS8yejBqNDNsaDk3SFlWS2hhU2RrU1RUV0JSc3FPbG9YR3JQSHM4ZlFEUnZNVHN4Rwo3K3NTam53dk5DVU9qclNrSThEWTVFM0hUYlpuYzhjTGFJb2x2b25qajd2RE9kM1phYVp6dEozcjJnQ2VORk0vCjFobTEyZGxOazN4a1JaMHpSV2ZOd0duZzhEMjhTd0xwZzhlTEQrZGdmQURwZmZBSWdhRmZQcTBTbXJGaDg1VlUKam40Qzh2aW1laHhMTFNJK2FUWlpiaE81ZXVaNXJOUXlSNC8wT1ptcUNrMVdweG9tcm9hWDBEd0pnb01LcFM5RApHYkFrNjRDWUZHcmNsMHZjV0pRWmlLaFErcnZmdUpZTHhtNHRjbUpEcGVob1k3VlJNWlAzMDZ6SDd6N2RRcEYrCk13OEdiZHhxRzNJQXlOaVBNOU8rZjdxQWJJN082OXBnTUJ1cVZVbkpkWS90SEZUcHdLWHJtOFpNRnBqenp4N2UKdHdwbWx6ZjQ2NzEwa1BiOHZGMVgwM2I0SFpRcUxQd0l5SVZoQ290Zk5VRzJWbnFGUnpQRm5xQkFYbit2NmxYZApKVldBN2pwTGdVakNLL1ozd1pLeE5hdE1MN1p3RXFjWXhKM096ckYzeWFtblA1N2pvd2ErMEpqdHIvTEI4SXA3ClpTUzlqYUY4VExoS3h4SDBuZmFIbUN4ZEFoMVdEaitCalpHN3hVQzc3UjY5RmJHU3N6K1hpZUtBa2lHcm54VmsKTzBuSk9rRkRoU0Jhc1hQYmEvK0VzallNMENDQWpDbmk3WGRWVnpHZVpIVzVpcEZZN1NqbThmWHl3dXNWZ2ptRQp3L3grS2tVbWg5S0MzcXNDQXdFQUFUQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FnRUFaRWo2ODRhN0lZWCtNWll6CnhTN201YXhmQzNkckJjenVyWW81R0tLRWdpL1RHS0lTbjlZb1JzaGRuQy8yQUxSOFpENXhTOURGWmdtcjJmNjYKM0JUWVdOeExQYUlBRWhrT25TQWRJVjh4elQ5OUpYVXFkYjB4cDFYNmR3UmhaenVtN2FjNjVzM2E1R29oNk8xYgpuYTQwMUovQ3B6NGIwbndxNGdMckZ2L3RsSXBTR01FNDlOVzY5ZnZSaXpLbjdFRGQ3bUNEMW1UUVJnYjdRYVVyCmhxYkJMV2lIbksrWm1iSC9wajQ5dWRuK0ZydVlKOEtBNmErZy81Z3hUekMrTU1lRmJIVVkwUTBDSjlhRTBJMlEKS1NVQlBlb0hESVZ3SFZ2aTNKUG0wT3RSdlhjOER4R2pwalhvMGRFNGpTYkF2YUJNM1AxRitaVTFmMlViRGd0dAprekluMXk5ekNqZE9TcVVUYmVqekQ4L2JFUkJWaXhMNGw5aUdpbnZuYmxHbmNHZUZyVjBRUXhSVHhkOFBBdGVoCllnUk9yQi9KS0I4NkN4K0I0UHpZOGh2WVR0azZvU0VkVDkzd1ExdEwyb2RQdTNmemM5aE82SGZNUTRtM3RSQ2kKM1JPV3NpOERqUFRyV1Q0eVFqN3NVWmVxVlF0N0FZazYvSi9uZTZMVS9KdjI4QkpCaE13SkJwYzNzK3hubldoRQoySisrOTEyeWFxdWR2eS9nM0M1VlQvVDVpeFBVdFY0emdJamc0T01FcXAxYkFxczZJOG50TUZFVitWQWdSVWRHCllEaUdUZmNXRm9Zb0IvaG9FZGplbzRjT3dmd01aaUxlcU1aNlZsQ0tLdWl1Mk5ZcERhcTBuOGova25iQXBkOXkKWFRQTFRPTWFMVlY2YW5YTmNpYmI2eHRFMnlZPQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCi0tLS0tQkVHSU4gQ0VSVElGSUNBVEUtLS0tLQpNSUlFclRDQ0FwVUNGRUFUMWt1RlVuWUd0eXBxYi8rTmhleFV3ckxiTUEwR0NTcUdTSWIzRFFFQkN3VUFNQkV4CkR6QU5CZ05WQkFNTUJsSnZiM1JEUVRBZUZ3MHlOREEzTWpVeE16VTRNelphRncweU5qRXdNamd4TXpVNE16WmEKTUJVeEV6QVJCZ05WQkFNTUNtTnNhV1Z1ZEdObGNuUXdnZ0lpTUEwR0NTcUdTSWIzRFFFQkFRVUFBNElDRHdBdwpnZ0lLQW9JQ0FRQzlDUEsrL2xtZUxHc2VWR25HWm1PK2Vsem9UQU4yMTdwSXZNOUQydE40WXU3b0YwVnpNOW91ClBKczVOZnVsbzFEam1pb0JBc0NGSGpiRzRISG1ySnRjTDg1OWxnQkcxWmFQUFJaMWxYKzEwcEkwYzZGV2tnZmoKNmR1QjhtbDhPUm1QeWtWYjlJNmQzLzIxT1krK1A5NWdkY1NVZElJM1pKMUx0VXdUNENHMHpscEhibC9CdFo1cwpabHFlOHFGU2phN2VyaHhuYStrRDJ5R1ZoQVRkTHRpalJwTHJ5RVBSSEU1OUZOaGtxNmpjTXFNakN2VWExNU9sCmJrZURrbXljT2VFT2M3S0ZzS1ZTdWhSWkw5U3JPaGp5Y0xWS3BGa0lkOVBHcTYvL0pRdUFRczJxdXdDRXdOWEcKY3YwV1I4QkptVUtKeTMrUHhjTUVubzBtUWtxa1NwcHNrdGNJbWw2cTUreDd2L3JJWXBCbUZvbTh6Y2hmOGxzMQp6Q1FhMmkvYWZsemRNQkRobVM1Z044dlBWNDhvaU4zaTNaY1lLeUNWMUUrbjBHQkhadHdnZWxacWlpbmZtYy84CmZTVmZLVmxsVERKTU5iRHlGRFUxSVJGbFBZMUdYeFZ4ZVd2WjVyUmo2WWd3TDVIQjRyaFI2NXcreTc3R3F5M3AKeTM3dDBabkhCRXprZG1SNE4xZ2Fycld3ZlNyRTEvWCthcmJCRDJHSHRZUjFOSENmclFzYUxQZndaellnTWRiSgpHdU9CMVkrSUdPMEJvbVVaQjlsaHM1NTdGZGpORVBFM2U4NHRFSHZOMVpUVWEyS0syc1hHcG81aE4xeGw5bVVQCklWZW14QkdnUTI3OFFVVnM0MGhqdGVFNW5wQXBZNEhGMnpTTExHUFFwZXl4NEJTaEkwSngwUUlEQVFBQk1BMEcKQ1NxR1NJYjNEUUVCQ3dVQUE0SUNBUUE4dk8weHlveW9aTmhObHBhK005ZW9hR1hQYmFBU003TjN6Nk1RWkV2bApDNlArVXhhS3BQWEhjL1d3UWpmRTdIT1JPUERPUlY1WEhDMlljV3lDTzUvNVRlenkxYkxYVU80ZGtybU5ZSDRLCnpVWkxiMWRZM3RqeUNEWFdRQWgyd2R4bUZwbjZoREtLbWdCVHFraUJWODVJRmhIUkFIbGM4eXpLYTF2cnVrZTQKcFM3amtvbDl6Wk1nK0ZZVFBPeGhIRzNYTzIwK1h0b3AvZU8yam9aaXZYRFpVRGI1Rjk1YjVnSExlQUMwcTVyMwo2Y1pUNGJ5YzF3WTZ0RG9BdFB1UWZseStGTElGYmd0RkhScXZDYlRQUkM3VEdpQzBkU2pjTmhvU0prNUMvQ1hsCll0TmxITXlrYzhRamxtUWhGZThSQWVHZkRBbWcvNjZoMWhkK1Npa1JFUkdCWkdFZm1mdXkzaFVNcSswZnBlZkYKQWZZZHd1dXNoNENBUW9kOUVOcjlnclF1YTc4aDU5RVFvcnEyR1RPUDNuQ1ppL1J3VmF5dWxmTVJZQmhsU2xsNgpGZ1BxdEVnRTRHbG1wZStCNGNxbGFhTllhRE9YMG8yNE9DYmpOelcrcldGWXlaZUZpeHZ0SFJ4aWpTRE81VEJRClJ1RWpWejNDWHZ3L2xsYzBwdnpHMkRpVCtGTGU3Q3RqZnFmVTZkcnhudkdBZnZIY201UkhsRXZ3d01hZ3NOSk8KRWxKZXlxOHNVRk1CTWlmbmdsZjRWaWs2NnhvTE01ZFlzQVQ2THBQL1B3bnJoWHRGNzRCZUVEYkdGaUc1cWUzVgpTSEYyKzVoTjJjem9CQ2FUVUp1SWJaWW5FR2VudnByRmxyWXFuVjZDYU1ub1RienVEY3ZWanJLOUZiNk9rdmg4CnlBPT0KLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQo=",
            "deviceKey": "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUpRUUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQ1Nzd2dna25BZ0VBQW9JQ0FRQ1ZxOW1WbStaNmVINloKRUQrZXhMdjAySlVjb1VtRWp1bVNkYmx3WUhuYm85ci9iUFNQamVXSDNzZGhVcUZwSjJSSk5OWUZHeW82V2hjYQpzOGV6eDlBTkc4eE96RWJ2NnhLT2ZDODBKUTZPdEtRandOamtUY2ROdG1kenh3dG9paVcraWVPUHU4TTUzZGxwCnBuTzBuZXZhQUo0MFV6L1dHYlhaMlUyVGZHUkZuVE5GWjgzQWFlRHdQYnhMQXVtRHg0c1A1MkI4QU9sOThBaUIKb1Y4K3JSS2FzV0h6bFZTT2ZnTHkrS1o2SEVzdElqNXBObGx1RTdsNjVubXMxREpIai9RNW1hb0tUVmFuR2lhdQpocGZRUEFtQ2d3cWxMME1ac0NUcmdKZ1VhdHlYUzl4WWxCbUlxRkQ2dTkrNGxndkdiaTF5WWtPbDZHaGp0VkV4CmsvZlRyTWZ2UHQxQ2tYNHpEd1p0M0dvYmNnREkySTh6MDc1L3VvQnNqczdyMm1Bd0c2cFZTY2wxaiswY1ZPbkEKcGV1Ynhrd1dtUFBQSHQ2M0NtYVhOL2pydlhTUTl2eThYVmZUZHZnZGxDb3MvQWpJaFdFS2kxODFRYlpXZW9WSApNOFdlb0VCZWY2L3FWZDBsVllEdU9rdUJTTUlyOW5mQmtyRTFxMHd2dG5BU3B4akVuYzdPc1hmSnFhYy9udU9qCkJyN1FtTzJ2OHNId2ludGxKTDJOb1h4TXVFckhFZlNkOW9lWUxGMENIVllPUDRHTmtidkZRTHZ0SHIwVnNaS3oKUDVlSjRvQ1NJYXVmRldRN1NjazZRVU9GSUZxeGM5dHIvNFN5Tmd6UUlJQ01LZUx0ZDFWWE1aNWtkYm1La1ZqdApLT2J4OWZMQzZ4V0NPWVREL0g0cVJTYUgwb0xlcXdJREFRQUJBb0lDQUVvZ0didE1RbG51V2ppaFFQajNVMlVnCmJMMElyaG51RTRUYk5CT1JYRmlvcnBucEVyZ1VIUlR0QXc3U3R5a1dmc2I0MlhRZTc0dUZ1Y0thUGpIdUtENk4Kd1dKWExseTlMZXdPV2V4MzI5MVdYcUpzYko2cFhLZEN5cnFlM2lvUW5UL2dGNmxFWXh4Q0lONS90dmRCYlNFRApSRmNDMGU5TnZYQWVmSnFxTlJqN0VYenl1NFpyaWFGQjJnTEdkdk15Zk05TUZzOWpQa0NHaEJmN1hXbnptbTZ0Cm9pYmFrczJkWUFXSW14Nkg2NzEzSTdURTI0YTJVeHFva2FORVZvQjFyWTFuYXJ6K2I0ZUQzcHQ2QWk3NXhQWHoKdzI1cTJVOGNHelRkYzdSTTltSWlDb2QrRmFWR1F4RGl3aHF2aVRabHM3RmVORVd6TkJ3Sm5TUXlOYitLWjF2MgpNR3dPd2tKcUtrN1RBQ0JvMnhENVkwU2Q5bUQvanJDV1QvSUNIcmEybG5lNUlXL2tnaXhTaVJlNEg3WXRkWE5CCkErYTRFNHJadkFsUzBTWjJiVlpEVEFEVnBKYTNYQjJESXQvMDV0U3hrNEt2Zjc3NzdQc3pMNzBibERDclhhMFkKajQxWG5RbXZQQlFXS3EzWksyK1F4WDM0eWhIcXEyeUVKVGxmbVEwcm04Nmp5aitzRitxZEI2dDBreDhtV0t1RQo4bGtlcy9xQW5uSG9GZGF6YlZUdTloMk9Rbm5IZHBqMHp0K0NsZ0tUQ3ZGTkQvYkpOSjRDYWRLUXpjUG4yS1hSCk1oa0ZJRXQycmJpOUFINzFDTjdoSHNVM3NQekthYzJielZKVi8zZ3pmakQyZEUvbVZXVDFmZEtWNGFGSHVNNlAKN25xTEVCdmpsUWJ3ZTlNb1dxWmhBb0lCQVFEUFBDUUYzK09LV1l6dVljZXZXUWltai9PcHVVU1U4czJ0d2ZyOQo5eGJzbElZdjZoaEpKT0o0N1Z0Qm5wUnB1UWdyUUkxQUlyQ09aRzc2L01USW8wRjlCT3BLbkpNVTdDZFYzU2RSCjBWWnpMVGpaUWJaZEx6dnc5VUhXT202RzJRdlVEMlZwalVKMmdBbG5CWXNMUkI4bS9RTzhMdGNnbEdkS0ppakEKT0NjQjlTWjNSRHdqaExLd0UrRW9xcDBtbUxBS2Q4aEJpVEVRWEkzMUdBRkZxRDdoSjBhRXhra01DRkhoOVJBZgpEcElZNS9Ka1VVV3JOa1Q0NFk3NjI3dWFDbTJPWEF0UEQwczdxMDNMNTRNZUpSNWV6YzBtQ3JQVi9IRjlIN3dICkJXd2hicWpTSXBScmxXYnBlMDBKQURtKyt5eFYrNDh5NFVqeU4wV08wOExHRCt6TEFvSUJBUUM0NUJGMGdKb2EKd1g3MnhhQWk5bXRlVVVjaWQrdHZVUzM1S1YwckFsRXhXTzlQeitPdzg2T0IyT2pNb2tHQVJHSW80Z0xRMHNIRgp4bEw2OWd1VlF1bXJ2Z2VmVm53NlVlNDZXcXlZbWlSTHVQRVpSZDdkLzFUdTRleDBlenZtN0MwRTBaVWlUaG55CkRwWm1pcXZpYkpId0FJVGR2dGJRLzVZN1pkV1grRnFvSG5hanQ3dyt5VXdDYmNjNGs1TDZJY2Z1Uk8xM0tSemQKMytOdDBRS1lZUWFReGd5NHZuTWN2ejNlSlN0ZlNWODJyRkJVeFJNWVRycytpQ1RiNmQrZFI4bk5iYnA3eUhnaApRZndaMjVPTEx6REVsUjNicGRuTWlVLzVtUnBvWkkySWtNd2dYaWhsTG1UeWVnMXRvOTI0UGdIVnk4MkNqTUlFCkVQN3M0NXNiV1htaEFvSUJBRG1TakxOeEdzYlIwQnhkMzlyd0VqNHIyZGE2R0xxRXBlMXk2YWJxb1Z6Q2VuRVAKU1FYeEVGWG1JeWNjeGtDRTNpY2QvTi9uZzBOYjFaVTI2ZmlQbWw4QUlaTHU0dEc2TmNkZDlGRi9wZFBEcVhwNgpEZzdmVTNqQ3VqS284eEhWZExyS09ETlZ3alFucC9VT0RpM29FL3VCNlNxN25KcDVnQ1NTYTFuVGY4ckViNVpNCng2UmFka1lDajlmN1prTlZ3ZnAyZ3BUcVowNFRXSURSMVhDanFDeG0rK2xoS09RRjM3RzFvbS91WFZvNy9oUXUKbS90UHpXT1RUbVNVN1E2RGZTSkNvZ1dweXczZHJuUktjaHZLMWlBaWJxNzE1RFk3dHMrN0pFS1RHQkpGcXZNTwpGa3U1S3VrTWp6OUQ1OGNPQXFnMGhmanRxNVZYRTZUMVliUWlzbmNDZ2dFQUJPVU16VC9HVktVQXZubTI1cFlOCmU1NjlPbDFnWHo4UDc0TzMwcmFwL1p0MEluSEhmbHpFM0dBb3Nab3VENzQvdHdOY3ZiaUdwcnk4WDZaNTRnYTIKZHZSOThTcngrUDFJU0VVMFFvbjZJZ01RWnZIaGw1RDE1NmtWZ0hQdXZ3dExtZEFPbWF6bHBQSGI2M1VLWGVFdgo3K0dqb3RjMWlxenBoa01JNTVBTW5seklHVWQ0OVZTUTdaT0liYWdDZ1JxNTEwWDkzMlM0UGV0NmN1TFFwY1lUCnpXdGcxTmM5NXVudE1sOWJpWmRBclFyY3laRzZFcStxNTFubFYra1dJV3pRRzk4bXk3WWY4QWwyS2gwVkI5OUUKOUQ5YVhnRkRCZFl3eHRQVnppT3pWNFUxMGptTDZqblRORlFrM04wMHRuYjF4M293dzU4RVYrVTNTb0F3RUFaTApZUUtDQVFBUWQzSU5WWExkV2VDVll6ZzhYelNzS28xZXNiMVdITXhXQVhUZ3k0Yyt1aGdjOUlkWENtc0lIRDViClM3eUpWb3AzV0svQmFGanpzWlVWOEo2d1U3L0tCamRpUkk5VG1uSWtIN2pCZ3c4bFBBQWk3c2RkL0FMV3BXWTEKSjBFTUE1di8yQzhVZXFWUUViaGowZGZSemZrR1BVMVRxU0lxUUxZQ2EySVppenNieE83Z3NMMnZ6V1JOUm84TgpadTh4NGxLMjlMdTRRNDNiNEFXeUl2RWoydTMvTkh1OVdYZjRlQ3hPMjRHNWVPSDhsd1JwTmxLVGlQd2xoMUtVCjM4M2tmUFE1MXhLQ0FlM1dCSUduZUc2Q0d5eVlURTU5NU80VVpkUWQxa0pPOVhRcHk3cFcvVERzcHNHb3g0eUIKOWwvS2Z6VDREU25rdEFzQ013aHF1ejhuSDR3ZQotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg=="
          }
        }
      ]
    }*/

    if (response && response.status == "success") {
      let content = response.data[0];
      const jsonStr = JSON.stringify(content, null, 2);

      // Step 3: Create a Blob with the JSON content
      const blob = new Blob([jsonStr], { type: 'application/json' });

      // Step 4: Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Step 5: Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'data.json'; // File name
      a.click();

      // Step 6: Clean up the Blob URL
      window.URL.revokeObjectURL(url);
      ret = true;
    }

    return ret;
  }

  async download_node(nodeId) {
    let fileLink = await this.download_node_file(nodeId);
    this.toast.createToast({
      type: "success",
      message: "Node downloaded successfully!!",
    });
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
    this.tableHeaders.shift();
    this.tableHeaders.unshift(`${this.activeTab} Name`);
    this.ListAvailableComponents(tab)
  }

  async ListAvailableComponents(asset_type) {
    if (asset_type == "Pipeline") {
      this.nodeDetailsSelectedSearchBarText = "Pipeline Running on Node";
      this.nodeDetailsSelectedSearchBarViewAllLinkText = "View all Pipelines";
      this.nodeDetailsActiveTabCreateNewBtnText = "Create New Pipeline";

      this.contentData = [
        {
          id: '0001',
          name: 'Pipeline 1',
          vcpus: 24,
          ram: '96',
          gpus: '0001',
          ssd: '512',
          pipelines: 0,
          tags: ['Tag 1', 'Tag 2', 'Tag 3'],
          status: 'Paused',
          statusPercentage: 52,
          statusClass: 'warning',
        },
        {
          id: '0002',
          name: 'Pipeline 2',
          vcpus: 32,
          ram: '128',
          gpus: '0001',
          ssd: '1024',
          pipelines: 0,
          tags: ['Tag 1', 'Tag 2', 'Tag 3'],
          status: 'Running',
          statusPercentage: 0,
          statusClass: 'success',
        }
      ]
    } else {
      this.nodeDetailsSelectedSearchBarText = "Pipeline Running Using Container";
      this.nodeDetailsSelectedSearchBarViewAllLinkText = "View all Containers";
      this.nodeDetailsActiveTabCreateNewBtnText = "Create New Container";

      this.contentData = [
        {
          id: '0001',
          name: 'Container 3',
          vcpus: 24,
          ram: '48',
          gpus: '0001',
          ssd: '256',
          pipelines: 0,
          tags: [
            'Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9', 'Tag 10',
            'Tag 11', 'Tag 12', 'Tag 13', 'Tag 14', 'Tag 15', 'Tag 16', 'Tag 17', 'Tag 18', 'Tag 19', 'Tag 20',
            'Tag 21', 'Tag 22', 'Tag 23', 'Tag 24', 'Tag 25', 'Tag 26', 'Tag 27', 'Tag 28', 'Tag 29', 'Tag 30',
            'Tag 31', 'Tag 32', 'Tag 33', 'Tag 34', 'Tag 35', 'Tag 36', 'Tag 37', 'Tag 38', 'Tag 39', 'Tag 40',
            'Tag 41', 'Tag 42', 'Tag 43', 'Tag 44', 'Tag 45', 'Tag 46', 'Tag 47', 'Tag 48', 'Tag 49', 'Tag 50',
            'Tag 51', 'Tag 52', 'Tag 53', 'Tag 54', 'Tag 55', 'Tag 56', 'Tag 57', 'Tag 58', 'Tag 59', 'Tag 60',
            'Tag 61', 'Tag 62', 'Tag 63', 'Tag 64', 'Tag 65', 'Tag 66', 'Tag 67', 'Tag 68', 'Tag 69', 'Tag 70',
            'Tag 71', 'Tag 72', 'Tag 73', 'Tag 74', 'Tag 75', 'Tag 76', 'Tag 77', 'Tag 78', 'Tag 79', 'Tag 80',
            'Tag 81', 'Tag 82', 'Tag 83', 'Tag 84', 'Tag 85', 'Tag 86', 'Tag 87', 'Tag 88', 'Tag 89', 'Tag 90',
            'Tag 91', 'Tag 92', 'Tag 93', 'Tag 94', 'Tag 95', 'Tag 96', 'Tag 97', 'Tag 98', 'Tag 99', 'Tag 100'
          ],
          status: 'Paused',
          statusPercentage: 64,
          statusClass: 'warning',
        },
        {
          id: '0004',
          name: 'Container 4',
          vcpus: 48,
          ram: '256',
          gpus: '0002',
          ssd: '2048',
          pipelines: 0,
          tags: ['Tag 1', 'Tag 2', 'Tag 3'],
          status: 'Running',
          statusPercentage: 10,
          statusClass: 'success',
        }
      ]
    }
  }

  funcOpenCreateNewModal() {
    this.openCreateNewModal = true
  }

  showall_tags(tags, name) {
    this.showAllTagsFlag = true;
    this.allTags = tags;
    this.whoseTag = name;
  }
  close_showall_tags() {
    this.showAllTagsFlag = false;
    this.allTags = [];
    this.whoseTag = '';
  }
  view_all_list() {
    this.currentPage = 1;
    this.showAllList = true;
    if (this.activeTab == 'Pipeline') {
      this.datasets = [
        {
          'Pipeline Name': 'Pipeline 1',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Pipeline Name': 'Pipeline 2',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Pipeline Name': 'Pipeline 3',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Pipeline Name': 'Pipeline 4',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Pipeline Name': 'Pipeline 5',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Pipeline Name': 'Pipeline 6',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Pipeline Name': 'Pipeline 7',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Pipeline Name': 'Pipeline 8',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        }
      ];
    } else {
      this.datasets = [
        {
          'Container Name': 'Container 1',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Container Name': 'Container 2',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Container Name': 'Container 3',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Container Name': 'Container 4',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Container Name': 'Container 5',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Container Name': 'Container 6',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Container Name': 'Container 7',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        },
        {
          'Container Name': 'Container 8',
          'Description': 'Nvidunt ut labore et dolore magna aliquy erat, sed diam voluptua labore et dolore magna.',
          'Tags': ['Tag 1', 'Tag 2', 'Tag 3', 'Tag 4', 'Tag 5', 'Tag 6', 'Tag 7', 'Tag 8', 'Tag 9']
        }
      ];
    }
    this.updatePaginatedData();
  }

  onSearch(query: string) {
    console.log('Search query:', query);
    // Handle search logic here

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

  map_to_node() {

  }

  upload_container_image() {

  }

  view_pipeline_container_details(itemId) {

  }
}
