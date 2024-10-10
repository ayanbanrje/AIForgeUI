import { Component, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from "../../services/message.service";

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
  showModal = true;
  

  constructor(
    private router: Router,
    private message: MessageService
  ) {}

  backToProjectList(){
    console.log("gggggggggg")
    this.router.navigate(['/projects']);
  }
  

  ngOnInit() {

    let self = this;
    this.message.createMessage({
      header: "Are you sure?",
      message: "You dont have access to this module, do you want to login as another user",
      isConfirm: true,
      yes: {
        label: "Yes",
        action: () => {
          // self.defaultErrorMsg();
          // self.router.navigate(["auth/login"]);
          // self.message.close();
        },
      },
      no: {
        label: "No",
        action: () => {
          // self.defaultErrorMsg();
          // self.router.navigate(["auth/login"]);
          self.message.close();
        },
      },
    });
    
    // Initialize Drawflow
    this.editor = new Drawflow(document.getElementById("drawflow") as HTMLElement);

    this.components = {
      "Source" : [
        {
          id : '1',
          name : "Source 1"
        },
        {
          id : '2',
          name : "Source 2"
        },
        {
          id : '3',
          name : "Source 3"
        },
        {
          id : '4',
          name : "Source 4"
        }
      ],
      "Algo" : [
        {
          id : '5',
          name : "Algo 1"
        },
        {
          id : '6',
          name : "Algo 2"
        },
        {
          id : '7',
          name : "Algo 3"
        },
        {
          id : '7',
          name : "Algo 4"
        }
      ],
      "Sink" : [
        {
          id : '9',
          name : "Sink 1"
        },
        {
          id : '10',
          name : "Sink 2"
        },
        {
          id : '11',
          name : "Sink 3"
        },
        {
          id : '12',
          name : "Sink 4"
        }
      ],
      // "Accumulator" : [
      //   {
      //     id : '13',
      //     name : "Accumulator 1"
      //   },
      //   {
      //     id : '14',
      //     name : "Accumulator 2"
      //   },
      //   {
      //     id : '15',
      //     name : "Accumulator 3"
      //   },
      //   {
      //     id : '16',
      //     name : "Accumulator 4"
      //   }
      // ]
    }
    //this.objectKeys = Object.keys(this.components);
  }

  ngAfterViewInit() {
      // Start the editor and add nodes after the view has been initialized
      this.editor.start();
      let exportvalue = this.editor.export();
      this.editor.import(exportvalue);
      this.editor.on('nodeCreated', (id) => {
        this.showAdditionalProperties(id);
        const nodeElement = document.querySelector(`#node-${id}`) as HTMLElement;
        if (nodeElement) {
          const existingListener = nodeElement.getAttribute('data-dblclick-listener');
          if (!existingListener) { // checking if dbclick event already attached
              nodeElement.addEventListener('dblclick', (event) => { //attach double click event
                event.preventDefault();
                event.stopPropagation(); 
                this.handleNodeClick(id); 
            });
          }
        }
        nodeElement.setAttribute('data-dblclick-listener', 'true'); // Setting attribute to check not to bind multiple dbclick event
      })
      //this.addNodes();
  }

  addNodes() {
    // // Add a "Start" node
    // const startNode = this.editor.addNode('start', 0, 1, 50, 50, 'start', {}, 'Start');

    // // Add a "Process" node
    // const processNode = this.editor.addNode('process', 1, 1, 250, 50, 'process', {}, 'Process');

    // // Add an "End" node
    // const endNode = this.editor.addNode('end', 1, 0, 450, 50, 'end', {}, 'End');


    // const rectNodeHTML = `<div class="drawflow-node-rect">Rectangular Node</div>`;
    // this.editor.addNode('rectangular', 1, 1, 100, 100, 'drawflow-node-rect', {}, rectNodeHTML);
    
    // // Example: Adding a circular node
    // const circleNodeHTML = `<div class="drawflow-node-circle">Circle Node</div>`;
    // this.editor.addNode('circle', 1, 1, 300, 100, 'drawflow-node-circle', {}, circleNodeHTML);
    
    // // // Example: Adding a rhombus node
    // const rhombusNodeHTML = `<div class="">R</div>`;
    // this.editor.addNode('rhombus', 1, 1, 600, 100, 'diamond', {}, rhombusNodeHTML);
    
    // // // Example: Adding a pentagon node
    // const pentagonNodeHTML = `<div class="">Hexagon Node</div>`;
    // this.editor.addNode('pentagon', 1, 1, 900, 100, 'hexagon', {}, pentagonNodeHTML);
  

    // Connect the nodes
    // this.editor.addConnection(startNode, processNode, 'output_1', 'input_1');
    // this.editor.addConnection(processNode, endNode, 'output_1', 'input_1');
  }

  allowDrop(event){
   // console.log("Allow Drop",event)
    event.preventDefault();
  }

  drag(ev:any) {
    
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
          this.addNodeToDrawFlow(this.mobile_item_selec, touch.clientX, touch.clientY);
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
      this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }
  }

  addNodeToDrawFlow(data: any, pos_x: any, pos_y: any) {
    console.log("name:",data)
    const editor = this.editor;
    if (editor.editor_mode === 'fixed' || ( this.sourceExist && data.type=='Source' ) ) {
      return false;
    }

    // Adjust positions based on zoom and canvas size
    pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
    pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

    let nodeClass = 'drawflow-node-rect';
    if(data.type=='Algo'){
      nodeClass = nodeClass;
    }

    if(data.type=='Sink'){
      nodeClass = 'hexagon';
    }

    if(data.type=='Source'){
      nodeClass = 'diamond';
      this.sourceExist = true;
    }

    if(data.type=='Accumulator'){
      nodeClass = 'drawflow-node-circle';
    }

    const rectNodeHTML = `<div class="custom-node">
        <p>${data.name}</p>
      </div>`;
    const nodeID = this.editor.addNode(data.name, 1, 1, pos_x, pos_y, nodeClass, data, rectNodeHTML);
    
    
    return;
  }

  toggleClass(event){
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

  export(){
    console.log("Canvus details: ",this.editor.export())
  }

  handleNodeClick(nodeID){
    console.log("Node ID: ",nodeID)
    console.log("Node Details on double click: ",this.editor.drawflow.drawflow.Home.data[nodeID])
  }

  showAdditionalProperties(nodeID){
    let nodeDetails = this.editor.drawflow.drawflow.Home.data[nodeID];

    console.log("On create details:", nodeDetails.data)
  }
}
