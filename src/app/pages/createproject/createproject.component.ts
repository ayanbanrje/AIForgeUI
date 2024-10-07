import { Component,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter,
  Input } from '@angular/core';
import { Router } from '@angular/router';

import Drawflow from 'drawflow'

@Component({
  selector: 'app-createproject',
  templateUrl: './createproject.component.html',
  styleUrl: './createproject.component.scss'
})
export class CreateprojectComponent implements
OnInit,
AfterViewInit{
  //@ViewChild('drawflow', { static: true }) drawflowEl!: ElementRef;
    editor: any;

  constructor(private router: Router) {}

  backToProjectList(){
    console.log("gggggggggg")
    this.router.navigate(['/projects']);
  }
  

  ngOnInit() {
    // Initialize Drawflow
    this.editor = new Drawflow(document.getElementById("drawflow") as HTMLElement);
  }

  ngAfterViewInit() {
      // Start the editor and add nodes after the view has been initialized
      this.editor.start();
      this.addNodes();
  }

  addNodes() {
    // Add a "Start" node
    const startNode = this.editor.addNode('start', 0, 1, 50, 50, 'start', {}, 'Start');

    // Add a "Process" node
    const processNode = this.editor.addNode('process', 1, 1, 250, 50, 'process', {}, 'Process');

    // Add an "End" node
    const endNode = this.editor.addNode('end', 1, 0, 450, 50, 'end', {}, 'End');

    // Connect the nodes
    this.editor.addConnection(startNode, processNode, 'output_1', 'input_1');
    this.editor.addConnection(processNode, endNode, 'output_1', 'input_1');
  }

  allowDrop(event){

  }
}
