import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, OnChanges } from '@angular/core';

@Component({
  selector: 'app-date-list',
  templateUrl: './date-list.component.html',
  styleUrls: ['./date-list.component.scss']
})
export class DateListComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild('myList', { static: false }) lt: ElementRef;
  @Input() pickerType = 'calendar';
  @Input() selectMode = 'range';
  @Input() placeholder= String;
  @Input() list = [];
  @Output() listChange = new EventEmitter();
  @Input() min: Date;
  @Input() max: Date;
  date;
  isExpanded = false;
  

  ngOnInit() {
    this.updateDate();
  }

  ngOnChanges() {
    this.updateDate();
  }

  updateDate() {
    if (this.list && this.list.length) {
      this.list = this.list.map(l => l = new Date(l));
    }
  }

  ngAfterViewInit() {
    const self = this;
    if (self.lt) {
      // tslint:disable-next-line:only-arrow-functions
      document.addEventListener('mouseup', function(e) {
        const container = self.lt.nativeElement;
        if (!container.contains(e.target)) {
          self.isExpanded = false;
        }
      }.bind(this));
    }
  }

  addDate(e) {
    if (!this.list) {
      this.list = [];
    }
    this.list.unshift(e);
    this.list = this.list.filter((date, i, self) =>
      self.findIndex(d => d.getTime() === date.getTime()) === i
    );
    this.update();
  }

  remove(l) {
    this.list = this.list.filter(e => e !== l);
    if (this.list && this.list.length <= 1 && this.isExpanded) {
      this.isExpanded = false;
    }
    this.update();
  }

  toggleClass() {
    this.isExpanded = !this.isExpanded;
  }

  update() {
    this.listChange.emit(this.list);
  }

}
