/**
 * @ Author: Ajay Sharma
 * @ Create Time: 2019 dec
 * @ Modified by: Your name
 * @ Modified time: 2019 dec
 * @ Description: area line graph
 */
import { Component, OnInit, OnChanges, ViewEncapsulation, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { Colors } from 'src/app/colors.constants';
import * as _ from 'lodash';
import { AppServiceHelper } from 'src/app/helpers/app.helper.service';
import * as svg from 'save-svg-as-png';
declare const window: any;

@Component({
  selector: 'app-multi-line2',
  templateUrl: './multi-line2.component.html',
  styleUrls: ['./multi-line2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MultiLine2Component implements OnInit, OnChanges {
  @ViewChild('ml2', { static: false }) element: ElementRef;
  @ViewChild('tooltip', { static: false }) tp: ElementRef;
  id: string;
  // tslint:disable-next-line:max-line-length
  @Input() data = [{ date: '1-May-12', close: '68.13', open: '34.12' }, { date: '30-Apr-12', close: '63.98', open: '45.56' }, { date: '27-Apr-12', close: '67.00', open: '67.89' }, { date: '26-Apr-12', close: '89.70', open: '78.54' }, { date: '25-Apr-12', close: '99.00', open: '89.23' }];
  @Input() xAxis = 'date';
  @Input() yAxis;
  @Input() areacolor;
  @Input() linecolor;
  @Input() legends;
  @Input() backgroundtooltip;
  @Input() view;
  @Input() status;
  colors = Colors.colors;
  focus: any;
  format = '%H:%M';
  tooltipVal;
  svg;
  margin;
  width;
  height;
  bisectDate;
  x;
  y;
  area;
  curve = d3.curveMonotoneX;
  parseTime;
  ticks = 5;
  points;
  keys = [];
  constructor(private appHelper: AppServiceHelper) {
    this.id = appHelper.randomString(10);
  }

  ngOnInit() {
    const self = this;
    window.setTimeout(() => {
      self.definition();
    }, 3000);
  }

  ngOnChanges() {
    const self = this;
    window.setTimeout(() => {
      self.definition();
    }, 100);
  }

  definition() {
    const height = this.element.nativeElement.clientHeight;
    const width = this.element.nativeElement.clientWidth;
    this.margin = { top: 50, right: 20, bottom: 20, left: 30 };
    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;

    // parse the date / time
    this.parseTime = d3.timeParse('%d-%b-%y');

    // set the ranges
    this.x = d3.scaleUtc().range([0, width]);
    d3.select(`#${this.id} svg *, #${this.id} .no-data`).remove();
    if (this.data && this.data.length) {
      this.draw();
      this.format = this.appHelper.timeFormatter(this.view);
      this.ticks = this.appHelper.tickFormatter(this.view);
    } else {
      this.noData();
    }
  }
  // drawing the svg component
  draw() {
    const self = this;
    self.drawLegends();
    const legendHeight = Number(d3.select('.legends').style('height').replace('px', ''));
    self.height = self.height + self.margin.top - legendHeight;
    this.y = d3.scaleLinear().range([self.height, 0]);
    self.svg = d3.select(`#${self.id} svg`)
      .attr('width', self.width + self.margin.left + self.margin.right)
      .attr('height', self.height)
      .append('g')
      .attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')');
    self.data.forEach((d: any) => {
      // d[self.xAxis] = self.parseTime(d[self.xAxis]);
      self.yAxis.forEach((dy: any) => {
        d[dy] = d[dy] ? +d[dy] : +0;
      });
    });
    self.x = d3.scaleUtc().range([10, self.width]);
    self.y = d3.scaleLinear().range([self.height - 90, 10]);
    // Scale the range of the data
    self.x.domain(d3.extent(self.data, (d: any) => {
      return new Date(d[self.xAxis]); // to set date from the back end service, here xAxis means 'HOURLY_TIMESTAMP'
    }));
    const max = [];
    self.yAxis.forEach((ym: any) => {
      max.push(_.maxBy(self.data, ym)[ym]);
    });
    self.y.domain([0, _.max(max)]);
    if (self.view === 'monthly') {
      self.data.forEach(d => {
        d[self.xAxis] = new Date(d[self.xAxis]).setDate(1);
      });
    }
    const timeScales = self.data.map(d => self.x(new Date(d[self.xAxis])));
    d3.select(`#${self.id} .points`).remove();
    self.data.forEach(d => {
      d3.select(`#${self.id}`)
        .append('div')
        .style('color', '#FFFFFF')
        .attr('class', 'points');
    });
    const focusX = self.svg.append('g')
      .attr('class', 'focusX')
      .style('display', 'none');
    const focusY = self.svg.append('g')
      .attr('class', 'focusY')
      .style('display', 'none');

    focusX.append('line')
      .attr('class', 'x-hover-line hover-line')
      .attr('y1', 0)
      .attr('y2', self.height - 90);

    focusY.append('line')
      .attr('class', 'y-hover-line hover-line')
      .attr('x1', 10)
      .attr('x2', self.width);

    this.yAxis.forEach((key, yi) => {
      // Add the valueline path.
      self.svg.append('path')
        .datum(self.data)
        .attr('class', `line ml2-l-${key.replace(/ /g, '_')}`)
        .attr('fill', '#f8f8f8')
        .attr('stroke', this.colors[yi])
        .attr('fill', '#FFFFFF')
        .attr('fill-opacity', 0)
        .attr('d', d3.line()
          .x(d => self.x(new Date(d[self.xAxis])))
          .y(d => self.y(d[key])));
    });

    this.yAxis.forEach((key, yi) => {
      const lineAndDots = self.svg.append('g')
        .attr('class', 'line-and-dots')
        .attr('transform', `translate(-2.5, -2.5)`);

      const hightlightX = d3.select(`#${self.id} .ml2-highlight-x`);
      const hightlightY = d3.select(`#${self.id} .ml2-highlight-y`);
      // Data dots
      lineAndDots.selectAll('line-circle')
        .data(self.data)
        .enter().append('rect')
        .attr('class', `data-circle ml2-l-${key.replace(/ /g, '_')}`)
        .attr('id', `${key.replace(/ /g, '_')}`)
        .attr('height', 6)
        .attr('width', 6)
        .attr('fill', (dm, dii) => (self.data.length === dii + 1) ? self.status[key] : self.colors[yi])
        .attr('transform', (d) => `translate(${self.x(new Date(d[self.xAxis]))},${self.y(d[key])})`)
        .on('mouseout', () => {
          focusX.style('display', 'none');
          focusY.style('display', 'none');
          d3.selectAll('.points').style('display', 'none');
          hightlightX.style('display', 'none');
          hightlightY.style('display', 'none');
        })
        // tslint:disable-next-line:only-arrow-functions
        .on('mouseover mousemove', function (d, i) {
          const di = self.data[i];
          const x = new Date(di[self.xAxis]);
          focusX.style('display', null);
          focusY.style('display', null);
          d3.selectAll('.points').style('display', 'block');
          focusX.attr('transform', `translate(${self.x(x)},0)`);
          focusX.style('display', null);
          focusY.attr('transform', () => {
            return `translate(0, ${self.y(di[key])})`;
          });
          focusY.style('display', null);
          // highlight xAxis
          hightlightX.style('display', 'block');
          hightlightY.style('display', 'block');
          hightlightX.html(d3.timeFormat(self.format)(x));
          hightlightY.html(Number(di[key]).toFixed(0));
          // const nodeh: any = hightlightX.node();
          // const rectsh = nodeh.getClientRects()[0];
          const nodeYh: any = hightlightY.node();
          const rectsY = nodeYh.getClientRects()[0];
          hightlightX.style('left', `${self.x(x) + 15}px`);
          hightlightX.style('top', `${self.height - 40}px`);

          hightlightY.style('left', `${self.margin.left - rectsY.width + 2}px`);
          hightlightY.style('top', `${self.y(di[key]) + 50 - (rectsY.height / 2)}px`);
          // hightlightX.style('background', color);
          self.appHelper.setTicks(hightlightX, ticks, null, true);
          d3.selectAll('.points')
            .style('left', `${self.x(x) + self.margin.left + 8}px`)
            .style('top', (a: any, it) => {
              return `${self.y(di[self.yAxis[it]]) + 40}px`;
            })
            .style('background', (b: any, ic) => self.colors[ic])
            .style('border', (c: any, ic) => self.colors[ic])
            .style('display', (ed: any, ih) => {
              return (di[self.yAxis[ih]] && Number(di[self.yAxis[ih]].toFixed(2))) ? 'block' : 'none';
            })
            .html((f: any, ih) => {
              return `${di[self.yAxis[ih]] ? di[self.yAxis[ih]].toFixed(2) : 0}`;
            });
        });
    });

    const ticks = (self.data && self.data.length) ? self.data.length : self.ticks;
    // Add the X Axis
    const g = self.svg.append('g')
      .attr('transform', 'translate(0,' + (self.height - 90) + ')')
      .call(d3.axisBottom(self.x)
        .ticks((self.data && self.data.length) ? self.data.length : self.ticks)
        .tickFormat(d3.timeFormat(self.format))).selectAll('text');


    self.appHelper.setTicks(g, ticks, true);

    // Add the Y Axis
    self.svg.append('g')
      .attr('transform', 'translate(10, 0)')
      .call(d3.axisLeft(self.y).ticks(5));

    self.drawLegends();
  }


  noData() {
    const self = this;
    d3.selectAll(`#${self.id} svg, #${self.id} .no-data, #${self.id} .legends *`).remove();
    this.svg = d3.select(`#${self.id}`).append('div').attr('class', 'no-data');
    this.svg.append('i')
      .attr('class', 'boschicon-bosch-ic-data-loss');
    this.svg.append('label')
      .attr('class', 'no-data')
      .text('No Data');
  }
  // Add the legends
  drawLegends() {
    const self = this;
    let uniqdata = [];
    this.data.forEach(da => {
      for (const d in da) {
        if (d !== self.xAxis) {
          uniqdata.push({
            id: d
          });
        }
      }
    });
    uniqdata = _.uniqBy(uniqdata, 'id');
    d3.selectAll(`#${self.id} .legends *`).remove();
    const legends = d3.select(`#${self.id} .legends`);
    uniqdata.forEach((u, index) => {
      const id = `ml2-l-${u.id}`;
      const legendLi = legends.append('li').attr('id', id.replace(/ /g, '_'));
      legendLi.append('span').style('background', this.colors[index]);
      legendLi.append('label').html(u.id.replace(/_/g, ' '));
      legendLi.on('click', () => {
        u.active = !u.active;
        legendLi.style('opacity', u.active ? '0.5' : '1');
        self.svg.selectAll(`.${id.replace(/ /g, '_')}`).style('display', u.active ? 'none' : '');
      });
    });
  }

  exportChart() {
    svg.saveSvgAsPng(document.getElementsByTagName("svg")[0], "chart.png", { scale: 1, backgroundColor: "#FFFFFF" });
  }
}
