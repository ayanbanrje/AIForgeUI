import { Component, OnInit } from '@angular/core';
import { PipelineService } from '../../services/backend/pipeline.service';

@Component({
  selector: 'app-projects',
  templateUrl: './pipeline.component.html',
  styleUrl: './pipeline.component.scss'
})
export class PipelineComponent implements OnInit {
  templates = [
    // { name: 'Template 1', description: 'Template 1 description' },
    // { name: 'Template 2', description: 'Template 2 description' },
    // { name: 'Template 3', description: 'Template 3 description' },
    // { name: 'Template 4', description: 'Template 4 description' },
    // { name: 'Template 5', description: 'Template 5 description' },
    // { name: 'Template 6', description: 'Template 6 description' },
    // { name: 'Template 7', description: 'Template 7 description' },
    // { name: 'Template 8', description: 'Template 8 description' }
  ];
  constructor(
    public pipelineService:PipelineService
  ){

  }
  ngOnInit(): void {
    this.ListTemplates()
  }
  async ListTemplates(){
    let response=await this.pipelineService.ListTemplates()
    this.templates=response['data']
  }

}
