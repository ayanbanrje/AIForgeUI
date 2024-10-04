import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-tooltip',
  templateUrl: './info-tooltip.component.html',
  styleUrls: ['./info-tooltip.component.scss']
})
export class InfoTooltipComponent implements OnInit {
  @Input() description: string;
  @Input() iconUrl: string;
  @Input() rtmC: Boolean;
  @Input() styles: any;
  @Input() spanStyles: any;
  @Input() iStyles: any;

  constructor() { }

  ngOnInit() {
  }

}
