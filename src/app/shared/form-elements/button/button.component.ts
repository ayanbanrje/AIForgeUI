/**
 * @author [SBA5COB] Sivaprakasharavi Baskaran
 * @email [Sivaprakasharavi.Baskaran@in.bosch.com]
 * @create date 2019-02-14 19:37:32
 * @modify date 2019-02-14 19:37:32
 * @desc [description]
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() text: string;
  @Input() icon: string;
  @Input() iposition = 'left';
  @Input() background: string;
  @Input() color: string;
  @Input() float: string;
  @Input() padding: string;
  @Input() margin: string;
  @Input() width: string;
  @Input() opacity: string;
  @Input() height: string;
  @Input() textAlign: string;
  @Input() borderRadius: string;
  @Input() alignItems: string;
  @Input() disabled: boolean;
  @Input() fontSize: string;
  @Input() desktop: boolean;
  @Input() position: string;
  @Input() top: string;
  @Input() left: string;
  @Input() bottom: string;
  @Input() right: string;
  @Input() class = 'primary';
  @Input() tooltip : string = "";
  @Output() klick = new EventEmitter();
  @Input() visible :string = 'flex' ;
  @Input() title = "";
  @Input() isFromLocation = false;
  @Input() isFromAppliance = false;
  @Input() responsiveButton = false;
  @Input() leftIconMR: string;

  ngOnInit() {
    if ( this.desktop && window.innerWidth >= 769) {
      this.visible = 'none';
    }
  }

  submit(mouseEvent: MouseEvent) {
    this.klick.emit();
    mouseEvent.stopPropagation();
  }

  onResize() {
    if ( this.desktop && window.innerWidth >= 769) {
      this.visible = 'none';
    } else {
      this.visible = 'unset';
    }
  }

}
