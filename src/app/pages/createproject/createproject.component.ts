import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createproject',
  templateUrl: './createproject.component.html',
  styleUrl: './createproject.component.scss'
})
export class CreateprojectComponent {

  constructor(private router: Router) {}

  backToProjectList(){
    console.log("gggggggggg")
    this.router.navigate(['/projects']);
  }
}
