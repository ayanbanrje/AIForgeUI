import { Component, OnInit, OnChanges, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
declare const window: any;
import * as _ from 'lodash';
import { AppServiceHelper } from 'src/app/helpers/app.helper.service';
import { parse } from 'querystring';

@Component({
  selector: 'app-horizontal-stack-bar',
  templateUrl: './horizontal-stack-bar.component.html',
  styleUrls: ['./horizontal-stack-bar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HorizontalStackBarComponent implements OnInit, OnChanges {
  @ViewChild('graphic', { static: false }) element: ElementRef;
  id = `id` + this.helperService.randomString(10);
  @Input() data = [];
  maxLength = 0;
  mapdata = [];
  svg;
  margin;
  width;
  height;
  flag = true;
  color = d3.scaleOrdinal(d3.schemeDark2);
  constructor(private helperService: AppServiceHelper) {
    this.id = `id${helperService.randomString(10)}`;
  }
  ngOnInit() {
    const self = this;
    window.setTimeout(() => {
      self.definitions();
    }, 100);
  }
  ngOnChanges() {
    const self = this;
    window.setTimeout(() => {
      self.definitions();
    }, 100);
  }
  definitions() {
    const self = this;
    self.margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const height = self.element.nativeElement.clientHeight;
    const width = self.element.nativeElement.clientWidth;
    self.width = width - self.margin.left - self.margin.right;
    self.height = height - self.margin.top - self.margin.bottom;
    if (this.data && this.data.length) {
      this.data = _.filter(this.data, 'ENERGY');
    }
    if (this.data && this.data.length) {
      this.data = _.filter(this.data, 'ENERGY');
      this.data = _.sortBy(this.data, 'NAME');
      this.data.forEach((d: any) => {
        d.title = d.NAME;
        // d.NAME = 'WWWWWWWWWWWWWW';
        // d.NAME = (d.NAME).length > 12 ? `${d.NAME.slice(0, 11)}...` : d.NAME;
      });
      this.load();
    } else {
      self.helperService.noData(self.id);
    }
  }
  load() {
    const self = this;
    d3.select(`#${self.id} svg, #${self.id} .no-data`).remove();
    self.height = self.data.length * 34;
    self.svg = d3.select(`#${self.id}`).append('svg')
      .attr('width', self.width + self.margin.left + self.margin.right)
      .attr('height', self.height + self.margin.top + self.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')');
    const maxDataValue = d3.max(self.data, ({ ENERGY }) => ENERGY ? parseFloat(ENERGY) : 0); // removed fixed(2)
    const x = d3.scaleLinear().range([0, self.width + (self.margin.left + self.margin.right)]).domain([0, maxDataValue]);

    const y = d3.scaleBand().rangeRound([0, self.height]).domain(self.data.map(d => d.NAME));
    const bars = self.svg.selectAll('.bar')
      .data(self.data)
      .enter()
      .append('g')
      .attr('class', 'b-group');
    const textWidth = [];
    bars.append('title').text(d => `${d.title} - ${d.ENERGY.toFixed(4)}`);
    bars.append('text')
      .attr('y', d => y(d.NAME) + 14)
      .attr('x', 0)
      .text(d => d.NAME).each(function () {
        textWidth.push(this.getBBox().width);
      }).each(function () {
        self.wrap(this, self);
      });
    self.maxLength = _.max(textWidth);
    self.maxLength = self.maxLength < 100 ? self.maxLength : 100;
    const rectWidth = [];
    bars.append('rect')
      .attr('y', d => y(d.NAME) + 4)
      .attr('height', 12)
      .attr('x', (self.maxLength + 10))
      .attr('width', d => {
        const ene = d.ENERGY; // removed fixed(2)
        const pVal = x(ene);
        // return ((pVal - (self.maxLength + (pVal*15)/100)) > 0) ? (pVal - (self.maxLength + (pVal*15)/100)) : pVal;
        return pVal * 0.70;
      }).each(function () {
        rectWidth.push(this.getBBox().width);
      });
    bars.append('circle')
      .attr('r', 14)
      .attr('cy', d => y(d.NAME) + 10)
      .attr('cx', (d, i) => (rectWidth[i] + self.maxLength + 22));
    bars.append('text')
      .attr('class', 'val')
      .attr('y', d => y(d.NAME) + 14)
      .attr('x', (d, i) => (rectWidth[i] + self.maxLength + 22))
      .text(d => d.ENERGY.toFixed(2));
  }

  wrap(element, comp) {
    const self = d3.select(element);
    let textLength = self.node().getComputedTextLength();
    let text = self.text();
    while (textLength > 100 && text.length > 0) {
      text = text.slice(0, -1);
      self.text(text + '...');
      textLength = self.node().getComputedTextLength();
    }
  }
}
