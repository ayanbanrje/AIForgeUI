import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from "../../services/message.service";
import { ModuleExtensionService } from "../../services/backend/module-extension.service";

import Drawflow from 'drawflow'

@Component({
  selector: 'app-createproject',
  templateUrl: './createproject.component.html',
  styleUrl: './createproject.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CreateprojectComponent {

  editor: any;
  components = {}; objectKeys = Object.keys;
  mobile_item_selec = '';
  mobile_last_move: { touches?: TouchList } = {};
  sourceExist = false;
  showModal = false;
  dropdownList = [];
  selectedItems = [];
  DBadditionalProperties = {}
  selectedItemAdditionalProperties = {};
  additionalPropertiesValueByUser: {};
  activeNodeDataDetails = {};
  rightPanelClass = '';
  tempSelectedNodeData:any;



  constructor(
    private router: Router,
    private message: MessageService,
    private moduleExtensionService : ModuleExtensionService
  ) { }

  backToProjectList() {

    this.message.createMessage({
      header: "Confirmation Required",
      message: "Are you sure you want to cancel? All changes will be discarded.",
      isConfirm: true,
      yes: {
        label: "Yes",
        action: () => {
          // self.defaultErrorMsg();
          this.router.navigate(['/projects']);
          this.message.close();
        },
      },
      no: {
        label: "No",
        action: () => {
          // self.defaultErrorMsg();
          this.message.close();
        },
      },
    });
  }


  ngOnInit() {
    // Initialize Drawflow
    this.editor = new Drawflow(document.getElementById("drawflow") as HTMLElement);
    
    this.setDefaultValues()
  }

  ngAfterViewInit() {
    // Start the editor and add nodes after the view has been initialized
    let self = this;
    this.editor.on('nodeCreated', (id) => {
      this.showAdditionalProperties(id);
      this.attachDoubleClickEvent(id)
    })
    this.editor.on('nodeSelected', (nodeId) => {
      const nodeData = this.editor.getNodeFromId(nodeId);
      this.tempSelectedNodeData = { ...nodeData }; 
    });
    this.editor.on('nodeRemoved', (nodeId) => {
      if (this.tempSelectedNodeData && this.tempSelectedNodeData.id == nodeId) {
        if(this.tempSelectedNodeData['data']['type']=='source'){
          this.sourceExist = false;
        }
        this.tempSelectedNodeData = null;
      }
      
    });

    this.editor.start();
    this.importDrawFlow();
  }

  attachDoubleClickEvent(id){
    const nodeElement = document.querySelector(`#node-${id}`) as HTMLElement;
      if (nodeElement) {
        const existingListener = nodeElement.getAttribute('data-dblclick-listener');
        if (!existingListener) { // checking if dbclick event already attached
          nodeElement.addEventListener('dblclick', (event) => { //attach double click event
            event.preventDefault();
            event.stopPropagation();
            this.updateProperties(id);
          });
        }
      }
    nodeElement.setAttribute('data-dblclick-listener', 'true'); // Setting attribute to check not to bind multiple dbclick event
  }

  async setDefaultValues(){
    this.components = {
      "source": await this.getComponents('source'),
      "algo": await this.getComponents('algo'),
      "sink": await this.getComponents('sink')
    }

    console.log(this.components)

    this.dropdownList = [
      { item_id: 1, item_text: 'Mumbai' },
      { item_id: 2, item_text: 'Bangaluru' },
      { item_id: 3, item_text: 'Pune' },
      { item_id: 4, item_text: 'Navsari' },
      { item_id: 5, item_text: 'New Delhi' }
    ];
    this.selectedItems = [
     // { item_id: 3, item_text: 'Pune' },
      //{ item_id: 4, item_text: 'Navsari' }
    ];

    this.DBadditionalProperties = {
      algo: {
        name: { type: "string" },
        age: { type: "int" },
        company: { type: "int" }
      },
      // Sink: {
      //   address: { type: "string" },
      //   email: { type: "string" }
      // },

      source: {
        city: { type: "dropdown", options: ['ban', 'pun', 'mum'] , multiple: false },
        country: { type: "dropdown", options: ['india', 'Germany', 'United Kingdom'] , multiple: false },
        email: { type: "string" }
      }
    }
  }

  importDrawFlow(){
    this.editor.import({
      "drawflow": {
        "Home": {
          "data": {
            "3": {
              "id": 3,
              "name": "Hello 3",
              "data": {
                "name": "Hello 3",
                "id": "c35d5e21-ab40-5786-9008-214e953ceeaa",
                "type": "source",
                "additionalProperties": {
                  "email": "Test@demo.com",
                  "city": {
                    "item_id": "ban",
                    "item_text": "Ban"
                  },
                  "country": {
                    "item_id": "Germany",
                    "item_text": "Germany"
                  }
                }
              },
              "class": "diamond",
              "html": "<div class=\"custom-node\">\n        <p>Hello 3</p>\n      </div>",
              "typenode": false,
              "inputs": {
                "input_1": {
                  "connections": []
                }
              },
              "outputs": {
                "output_1": {
                  "connections": [
                    {
                      "node": "4",
                      "output": "input_1"
                    }
                  ]
                }
              },
              "pos_x": 57,
              "pos_y": 5
            },
            "4": {
              "id": 4,
              "name": "algo_10",
              "data": {
                "name": "algo_10",
                "id": "8165049e-e77a-5a52-843b-1aeea52a0c9a",
                "type": "algo",
                "additionalProperties": {
                  "company": "Demo 1",
                  "name": "Algo 11",
                  "age": "12"
                }
              },
              "class": "drawflow-node-rect",
              "html": "<div class=\"custom-node\">\n        <p>algo_10</p>\n      </div>",
              "typenode": false,
              "inputs": {
                "input_1": {
                  "connections": [
                    {
                      "node": "3",
                      "input": "output_1"
                    }
                  ]
                }
              },
              "outputs": {
                "output_1": {
                  "connections": [
                    {
                      "node": "5",
                      "output": "input_1"
                    }
                  ]
                }
              },
              "pos_x": 243,
              "pos_y": 189
            },
            "5": {
              "id": 5,
              "name": "Hello",
              "data": {
                "name": "Hello",
                "id": "876a39b8-c05c-5901-987a-d33b5898671d",
                "type": "algo",
                "additionalProperties": {
                  "company": "Demo 2",
                  "name": "algo 22",
                  "age": "14"
                }
              },
              "class": "drawflow-node-rect",
              "html": "<div class=\"custom-node\">\n        <p>Hello</p>\n      </div>",
              "typenode": false,
              "inputs": {
                "input_1": {
                  "connections": [
                    {
                      "node": "4",
                      "input": "output_1"
                    }
                  ]
                }
              },
              "outputs": {
                "output_1": {
                  "connections": [
                    {
                      "node": "6",
                      "output": "input_1"
                    }
                  ]
                }
              },
              "pos_x": 454,
              "pos_y": 395
            },
            "6": {
              "id": 6,
              "name": "file_sink",
              "data": {
                "name": "file_sink",
                "id": "6439ef79-a07c-56fc-94f0-cfd7b26948ae",
                "type": "sink"
              },
              "class": "hexagon",
              "html": "<div class=\"custom-node\">\n        <p>file_sink</p>\n      </div>",
              "typenode": false,
              "inputs": {
                "input_1": {
                  "connections": [
                    {
                      "node": "5",
                      "input": "output_1"
                    }
                  ]
                }
              },
              "outputs": {
                "output_1": {
                  "connections": []
                }
              },
              "pos_x": 702,
              "pos_y": 510
            }
          }
        }
      }
    });

    Object.keys(this.editor.drawflow.drawflow[this.editor.module].data).forEach((nodeId) => {
      if(this.editor.drawflow.drawflow[this.editor.module].data[nodeId]['data']['type']=='source'){
        this.sourceExist = true;
      }
      this.attachDoubleClickEvent(nodeId)
    });
  }

  getComponents(type:string) {
    return new Promise(async resolve=>{
      let data = await this.moduleExtensionService.ListAvailableCustomComponents({
        user_id:"54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
        asset_type:type,
        startIndex:0,
        numberOfItems:5
      });

      let resData = [];

      console.log("data:",data)
      if(data['status']=='success'){
        resData = data['data']
      }

      resolve(resData)
    })
    
  }

  allowDrop(event) {
    // console.log("Allow Drop",event)
    event.preventDefault();
  }

  drag(ev: any) {

    if (ev.type === "touchstart") {
      this.mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
    } else {
      ev.dataTransfer.setData("name", ev.target.getAttribute('data-name'));
      ev.dataTransfer.setData("id", ev.target.getAttribute('data-id'));
      ev.dataTransfer.setData("type", ev.target.getAttribute('data-type'));
    }

  }

  drop(ev: any) {
    ev.preventDefault();  // Prevent default behavior
    if (ev.type === "touchend") {
      if (this.mobile_last_move && this.mobile_last_move.touches && this.mobile_last_move.touches.length > 0) {
        const touch = this.mobile_last_move.touches[0];

        const parentdrawflow = document.elementFromPoint(touch.clientX, touch.clientY)?.closest("#drawflow");

        if (parentdrawflow != null) {
          this.checkAdditionalProperties(this.mobile_item_selec, touch.clientX, touch.clientY);
        }

        this.mobile_item_selec = '';
      }
    } else {
      ev.preventDefault();
      let data = {};
      data['name'] = ev.dataTransfer.getData("name");
      data['id'] = ev.dataTransfer.getData("id");
      data['type'] = ev.dataTransfer.getData("type");
      //console.log("data:",data)
      this.checkAdditionalProperties(data, ev.clientX, ev.clientY);
      
    }
  }

  checkAdditionalProperties(data, clientX=null, clientY=null, edit=false){
    
    if(this.DBadditionalProperties[data['type']] && Object.keys(this.DBadditionalProperties[data['type']]).length > 0 ){
      //this.showModal = true;
      this.rightPanelClass = 'show';
      let typeString = ['int','number','string']
      
      let selecteItemProperties = this.DBadditionalProperties[data['type']];

      for(let key of Object.keys(selecteItemProperties)){

        let keyToUseToStoreValue = key.replace(/[^a-zA-Z0-9]/g, '_');

        selecteItemProperties[key]['actuelType'] = selecteItemProperties[key]['type'];
        selecteItemProperties[key]['placeHolder'] =  key.charAt(0).toUpperCase() + key.slice(1)
        selecteItemProperties[key]['keyToUseToStoreValue'] =  keyToUseToStoreValue

        if(typeString.indexOf(selecteItemProperties[key]['type']) >= 0){ // convert int,string,number as input box
          selecteItemProperties[key]['type'] = 'string';
        }else{
          selecteItemProperties[key]['type'] =='dropdown';
          selecteItemProperties[key]['multiple'] = selecteItemProperties[key]['multiple']?selecteItemProperties[key]['multiple']:false;
          selecteItemProperties[key]['optionList'] = selecteItemProperties[key]['options'].map(i=>{
            let id = i['item_id'] ? i['item_id'] : i;
            let value = i['item_text'] ? i['item_text'] : i;
            return { "item_id": id, "item_text": value.charAt(0).toUpperCase() + value.slice(1) }
          })
        }

        if(!edit){
          this.additionalPropertiesValueByUser = {
            [keyToUseToStoreValue] : ''
          }
        }

        /*
         city: { type: "dropdown", options: ['ban', 'pun', 'mum'], multiselect: 'yes' },
        email: { type: "string" }
        */
      }

      this.selectedItemAdditionalProperties = Object.assign({},selecteItemProperties)
    }

    if(clientX && clientY){
      this.addNodeToDrawFlow(data, clientX, clientY);
    }
  }

  addNodeToDrawFlow(data: any, pos_x: any, pos_y: any) {
    const editor = this.editor;
    this.activeNodeDataDetails = {};
    if (editor.editor_mode === 'fixed' || (this.sourceExist && data.type == 'source')) {
      this.rightPanelClass = "";
      return false;
    }

    // Adjust positions based on zoom and canvas size
    pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
    pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

    let nodeClass = 'drawflow-node-rect';
    if (data.type == 'algo') {
      nodeClass = nodeClass;
    }

    if (data.type == 'sink') {
      nodeClass = 'hexagon';
    }

    if (data.type == 'source') {
      nodeClass = 'diamond';
      this.sourceExist = true;
    }

    if (data.type == 'accumulator') {
      nodeClass = 'drawflow-node-circle';
    }

    const rectNodeHTML = `<div class="custom-node">
        <p>${data.name}</p>
      </div>`;
    
    this.activeNodeDataDetails['id'] = this.editor.addNode(data.name, 1, 1, pos_x, pos_y, nodeClass, data, rectNodeHTML);


    return 0;
  }

  toggleClass(event) {
    const buttonElement = event.target as HTMLElement;

    // Find the parent element
    const parentElement = buttonElement.parentElement;

    if (parentElement) {
      // Find the element with class "collapse" inside the parent element
      const collapseElement = parentElement.querySelector('.collapse') as HTMLElement;

      if (collapseElement.classList.contains('show')) {
        collapseElement.classList.remove('show'); // Remove 'show' to hide
        //collapseElement.style.display = 'none';   // Also hide via inline style
      } else {
        collapseElement.classList.add('show');    // Add 'show' to display
        // collapseElement.style.display = 'block';  // Also show via inline style
      }
    }
  }

  export() {
    console.log("Canvus details: ", this.editor.export())

    for(let key of Object.keys(this.editor.drawflow.drawflow.Home.data)){

    }
  }

  showAdditionalProperties(nodeID) {
    let nodeDetails = this.editor.drawflow.drawflow.Home.data[nodeID];
  }

  runPipeline(){}

  storeAdditionalProperty(value:any,key){
    this.additionalPropertiesValueByUser[key] = value;
  }

  setPropertyValueToNode(){
    let nodeData = this.editor.getNodeFromId(this.activeNodeDataDetails['id']);

    nodeData['data']['additionalProperties'] = this.additionalPropertiesValueByUser
    this.editor.updateNodeDataFromId(this.activeNodeDataDetails['id'], nodeData['data']);

    console.log(this.editor.export())

    this.showModal = false;
    this.rightPanelClass = '';
  }

  updateProperties(nodeID) {

    this.activeNodeDataDetails['id'] = nodeID;
    let nodeData = this.editor.getNodeFromId(this.activeNodeDataDetails['id']);

    this.additionalPropertiesValueByUser = Object.assign({});
    for(let key in nodeData['data']['additionalProperties']){
      this.activeNodeDataDetails[key] = nodeData['data']['additionalProperties'][key];
      this.storeAdditionalProperty(nodeData['data']['additionalProperties'][key],key)
    }

    this.checkAdditionalProperties(nodeData['data'],null,null,true)
    //this.showModal = true;
    //this.openPanel();
    
  }

  // openPanel() {
  //   document.getElementById('rightPanel').classList.add('show');
  // }
  
  // closePanel() {
  //   document.getElementById('rightPanel').classList.remove('show');
  // }
}
