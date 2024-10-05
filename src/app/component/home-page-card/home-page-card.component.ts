import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-page-card',
  templateUrl: './home-page-card.component.html',
  styleUrl: './home-page-card.component.scss'
})
export class HomePageCardComponent {
  @Input() title="title";
  @Input() description="description";
  @Input() imageUrl="";
  @Input() icon="";
  @Input() showArrow: boolean = false;
}
