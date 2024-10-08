import { Component, ViewEncapsulation} from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  backToProjectList(){
    console.log("gggggggggg")
    this.router.navigate(['/projects']);
  }
  

  ngOnInit() {
    
    // Initialize Drawflow
    this.editor = new Drawflow(document.getElementById("drawflow") as HTMLElement);

    this.components = {
      "Source" : [
        {
          name : "Source 1"
        },
        {
          name : "Source 2"
        },
        {
          name : "Source 3"
        },
        {
          name : "Source 4"
        }
      ],
      "Algo" : [
        {
          name : "Algo 1"
        },
        {
          name : "Algo 2"
        },
        {
          name : "Algo 3"
        },
        {
          name : "Algo 4"
        }
      ],
      "Sink" : [
        {
          name : "Sink 1"
        },
        {
          name : "Sink 2"
        },
        {
          name : "Sink 3"
        },
        {
          name : "Sink 4"
        }
      ],
      "Accumulator" : [
        {
          name : "Accumulator 1"
        },
        {
          name : "Accumulator 2"
        },
        {
          name : "Accumulator 3"
        },
        {
          name : "Accumulator 4"
        }
      ]
    }
    //this.objectKeys = Object.keys(this.components);
  }

  ngAfterViewInit() {
      // Start the editor and add nodes after the view has been initialized
      this.editor.start();
      this.addNodes();
  }

  addNodes() {
    // // Add a "Start" node
    // const startNode = this.editor.addNode('start', 0, 1, 50, 50, 'start', {}, 'Start');

    // // Add a "Process" node
    // const processNode = this.editor.addNode('process', 1, 1, 250, 50, 'process', {}, 'Process');

    // // Add an "End" node
    // const endNode = this.editor.addNode('end', 1, 0, 450, 50, 'end', {}, 'End');


    const rectNodeHTML = `<div class="drawflow-node-rect">Rectangular Node</div>`;
    this.editor.addNode('rectangular', 1, 1, 100, 100, 'drawflow-node-rect', {}, rectNodeHTML);
    
    // Example: Adding a circular node
    const circleNodeHTML = `<div class="drawflow-node-circle">Circle Node</div>`;
    this.editor.addNode('circle', 1, 1, 300, 100, 'drawflow-node-circle', {}, circleNodeHTML);
    
    // // Example: Adding a rhombus node
    const rhombusNodeHTML = `<div class="">R</div>`;
    this.editor.addNode('rhombus', 1, 1, 600, 100, 'diamond', {}, rhombusNodeHTML);
    
    // // Example: Adding a pentagon node
    const pentagonNodeHTML = `<div class="">Hexagon Node</div>`;
    this.editor.addNode('pentagon', 1, 1, 900, 100, 'hexagon', {}, pentagonNodeHTML);
  

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
      ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));

      console.log("Data-Node: ", ev.target.getAttribute('data-node'))
    }
    
  }

  drop(ev: any) {
    console.log("Dropeed:::::")
    ev.preventDefault();  // Prevent default behavior
    console.log(ev)
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
      var data = ev.dataTransfer.getData("node");
      console.log("data:",data)
      this.addNodeToDrawFlow(data, ev.clientX, ev.clientY);
    }
  }

  addNodeToDrawFlow(name: any, pos_x: any, pos_y: any) {
    console.log("name:",name)
    const editor = this.editor;
    if (editor.editor_mode === 'fixed') {
      return false;
    }
  
    // Adjust positions based on zoom and canvas size
    pos_x = pos_x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
    pos_y = pos_y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));

    const rectNodeHTML = `<div class="drawflow-node-circle">Rectangular Node</div>`;
    const endNode = this.editor.addNode('end', 1, 0, pos_x, pos_y, 'drawflow-node-circle', {}, rectNodeHTML);
    return;
  }
}
