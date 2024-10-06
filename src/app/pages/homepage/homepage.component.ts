import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
Router
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  cardItems = [
    {
      id: 'projects',
      title: 'Create New Project',
      description: 'Start a new project by uploading your dataset and streamline your data cleaning process.',
      imageUrl: '../../../assets/images/document-add.png',
      icon:'boschicon-bosch-ic-document-add',
      showArrow:false
    },
    {
      id: 'moduleextention',
      title: 'Module Extension',
      description: 'Add custom algorithms to enhance your data processing capabilities for tailored solutions.',
      imageUrl: '../../assets/images/ccu-cm.png',
      icon:'boschicon-bosch-ic-ccu-cm',
      showArrow:false
    },
    {
      id: 'nodeconfiguration',
      title: 'Node Configuration',
      description: 'Optimize your data pipeline with flexible node settings for efficient machine learning workflows.',
      imageUrl: '../../assets/images/connectivity.png',
      icon:'boschicon-bosch-ic-connectivity',
      showArrow:false
    },
    {
      id: 'datasets',
      title: 'Data Sets',
      description: 'Access a library of pre-processed datasets to kickstart your machine learning projects.',
      imageUrl: '../../assets/images/core-data.png',
      icon:'boschicon-bosch-ic-core-data',
      showArrow:false
    },
    {
      id: 'marketplace',
      title: 'Market Place',
      description: 'Explore resources in our marketplace for premium datasets and advanced training modules.',
      imageUrl: '../../assets/images/Group 303977.png',
      icon:'boschicon-bosch-ic-store',
      showArrow:false
    }
  ];
  constructor(
    public router:Router
  ){

  }

  menuClick(routeLink){
    console.log("routeLink",routeLink)
    this.router.navigate([`/${routeLink}`]);

  }
  hoverCard(isHovered: boolean, index: number) {
    this.cardItems[index].showArrow = isHovered;
  }
  
}
