import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from "../../services/message.service";
import { ModuleExtensionService } from "../../services/backend/module-extension.service";
import { ResourcesService } from "../../services/backend/resources.service";

import Drawflow from 'drawflow'

@Component({
  selector: 'app-createpipeline',
  templateUrl: './createpipeline.component.html',
  styleUrl: './createpipeline.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CreatepipelineComponent {

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
  pipelineMetaInfo = {
    "name":"", 
		"id":"",
		"tagString" : "",
		"path":"",
    "description": ""	,
    "tags" : []
  };



  constructor(
    private router: Router,
    private message: MessageService,
    private moduleExtensionService : ModuleExtensionService,
    private resourcesService : ResourcesService
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

  stringifyDependencies(dependencies: any[]): string {
    return JSON.stringify(dependencies);
  }

  ngOnInit() {
    // Initialize Drawflow
    this.editor = new Drawflow(document.getElementById("drawflow") as HTMLElement);
    
    this.setDefaultValues()

    this.pipelineMetaInfo.name==""?this.showModal=true:"";
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
    //this.importDrawFlow();
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
   
    this.DBadditionalProperties = {
      algo: await this.getAdditionalProperties('algo'),
      sink : await this.getAdditionalProperties('sink'),
      source: await this.getAdditionalProperties('source')
    }
  }

  importDrawFlow(){
    this.editor.import({
      "drawflow": {
        "Home": {
          "data": {
            "1": {
              "id": 1,
              "name": "Hello 3",
              "data": {
                "name": "Hello 3",
                "id": "c35d5e21-ab40-5786-9008-214e953ceeaa",
                "type": "source",
                "refId": "null",
                "className": "Hello 3",
                "classpath": "null",
                "additionalProperties": {
                  "email": "csacsac",
                  "city": {
                    "item_id": "ban",
                    "item_text": "Ban"
                  },
                  "country": {
                    "item_id": "india",
                    "item_text": "India"
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
                      "node": "2",
                      "output": "input_1"
                    }
                  ]
                }
              },
              "pos_x": 119,
              "pos_y": 56.350006103515625
            },
            "2": {
              "id": 2,
              "name": "F",
              "data": {
                "name": "F",
                "id": "057173b4-4dd7-5905-8a13-40442a1c8162",
                "type": "algo",
                "refId": "null",
                "className": "F",
                "classpath": "null",
                "additionalProperties": {
                  "company": "CSAsa",
                  "name": "xasc",
                  "age": "cA"
                }
              },
              "class": "drawflow-node-rect",
              "html": "<div class=\"custom-node\">\n        <p>F</p>\n      </div>",
              "typenode": false,
              "inputs": {
                "input_1": {
                  "connections": [
                    {
                      "node": "1",
                      "input": "output_1"
                    }
                  ]
                }
              },
              "outputs": {
                "output_1": {
                  "connections": [
                    {
                      "node": "3",
                      "output": "input_1"
                    }
                  ]
                }
              },
              "pos_x": 505,
              "pos_y": 86
            },
            "3": {
              "id": 3,
              "name": "file_sink",
              "data": {
                "name": "file_sink",
                "id": "6439ef79-a07c-56fc-94f0-cfd7b26948ae",
                "type": "sink",
                "refId": "null",
                "className": "file_sink",
                "classpath": "19b4a38c-3cff-56e7-b634-08e7ac112681.sink.file_sink"
              },
              "class": "hexagon",
              "html": "<div class=\"custom-node\">\n        <p>file_sink</p>\n      </div>",
              "typenode": false,
              "inputs": {
                "input_1": {
                  "connections": [
                    {
                      "node": "2",
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
              "pos_x": 876,
              "pos_y": 104
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
      ev.dataTransfer.setData("refId", ev.target.getAttribute('data-refId'));
      ev.dataTransfer.setData("className", ev.target.getAttribute('data-className'));
      ev.dataTransfer.setData("classpath", ev.target.getAttribute('data-classpath'));
      ev.dataTransfer.setData("dependencies", ev.target.getAttribute('data-dependencies'));
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
      data['refId'] = ev.dataTransfer.getData("refId");
      data['className'] = ev.dataTransfer.getData("className");
      data['classpath'] = ev.dataTransfer.getData("classpath");
      data['dependencies'] = JSON.parse(ev.dataTransfer.getData("dependencies"));
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
    let flow = [];
    let accOut, accumulatorArray = []

    for(let key of Object.keys(this.editor.drawflow.drawflow.Home.data)){
      let nodeData = this.editor.drawflow.drawflow.Home.data[key];
      let accIn = "";
      let instances = nodeData['data']['additionalProperties'] ? nodeData['data']['additionalProperties'] : [] ;
      
      if(accOut && nodeData['data']['type']!='source'){
        accIn = accOut;
      }

      accOut = `acc${nodeData.id}`;
      if(accOut && nodeData['data']['type']=='sink'){
        accOut = "";
      }else{
        accumulatorArray.push({
          "id": `${accOut}`,
          "name": `output_accumulator${nodeData.id}`,
          "refId": "acc_config",
          "kwargs": {},
          "className": "FileAcc",
          "classPath": "accumulator.file_acc"
        })
      }

      let childNodes=[]; let parentNodes=[];
      if(nodeData['inputs']){
        nodeData['inputs']['input_1']['connections'].map(c=>{
          parentNodes.push(this.editor.drawflow.drawflow.Home.data[c.node]['data']['id']);
        })
      }

      if(nodeData['outputs']){
        nodeData['outputs']['output_1']['connections'].map(c=>{
          childNodes.push(this.editor.drawflow.drawflow.Home.data[c.node]['data']['id']);
        })
      }

      let flowObj = {
        "id": `${nodeData['data']['id']}`,
        "type": nodeData['data']['type'],
        "refId": nodeData['data']['refId'],
        "accOut" : accOut,
        "kwargs": {
          "instances": [instances]
        },
        "className": nodeData['data']['className'],
        "classPath": nodeData['data']['classPath'],
        "dependencies":nodeData['data']['dependencies'],
        "parent": parentNodes.toString(), 
        "children" : childNodes
      }

      if(accIn!=""){
        flowObj['accIn'] = accIn;
      }
      flow.push(flowObj);
    }

    let pipelieneMetaInfoConvertedTag = this.pipelineMetaInfo;
    pipelieneMetaInfoConvertedTag['tags'] = this.pipelineMetaInfo.tagString.split(",");
    delete this.pipelineMetaInfo.tagString;

    let pipelineObj = {
      "user_id": "54a226b9-8ea6-4370-b0b0-c256b2ab8f87",
      "type": "mlpipeline",
      "apiVersion" : "v1",
      "flow" : flow,
      "acc" : accumulatorArray,
      "style" : this.editor.export(),
      "meta" : this.pipelineMetaInfo
    }

    console.log(pipelineObj)
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

  getAdditionalProperties(type:string){
    return new Promise(async (resolve)=>{
      let data = await this.resourcesService.get_argsdef({
        "node_type" : type
      })

      if(data['error_message']==""){
        let returnObj = {};
        for(let item of data.data){
          returnObj[item['name']] = { type : item['type'] }
        }
        resolve(returnObj)
      }else{
        resolve({})
      }
    })
  }

  saveMetaInfo(){
    this.showModal = false;
  }
}
