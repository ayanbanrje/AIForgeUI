import { Component, OnInit, OnChanges, Input, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { AppServiceHelper } from 'src/app/helpers/app.helper.service';

@Component({
  selector: 'app-arc',
  templateUrl: './arc.component.html',
  styleUrls: ['./arc.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArcComponent implements OnChanges, OnInit {
  id: string;
  @ViewChild('arc', { static: false }) element: ElementRef;
  @Input() data = {
    target: 0,
    value: 0,
    shadow: 0
  };
  width = 100;
  tau = 2 * Math.PI;
  definitions = {
    radius: {
      inner: 70,
      outer: 50,
      corner: 10
    },
    size: 170
  };

  formatted = {
    value: 0,
    count: []
  };

  constructor(private appHelper: AppServiceHelper) {
    this.id = `id-${appHelper.randomString(10)}`;
  }

  ngOnInit(): void {
    this.loader();
  }

  ngOnChanges(): void {
    this.loader();
  }

  loader() {
    const self = this;
    window.setTimeout(() => {
      self.width = self.element.nativeElement.clientWidth;
      if (self.data) {
        let { target, value } = self.data;
        target = Number(target);
        value = Number(value);
        if (target) {
          self.data.shadow = target + 50;
        }
        if (value) {
          self.formatted.value = value;
          if (value > target) {
            self.formatted.value = Number(value % target) + Number(target);
          }
          const count = Math.floor(value / target);
          self.formatted.count = Array(count).fill(0).map((x, i) => i);
        }
      }
      self.arcDefinitions();
    }, 100);
  }

  arcMaker(ir: number, or: number, cr?: number, sa?: number) {
    return d3.arc().innerRadius(ir).outerRadius(or).startAngle(sa ? sa : 0)
      .cornerRadius(cr ? cr : 0);
  }

  arcDefinitions() {
    const self = this;
    const { width } = self;
    const { size, radius: { inner, outer, corner } } = self.definitions;
    const arc1 = self.arcMaker(inner, outer, corner);
    const arc2 = self.arcMaker(inner, outer);
    d3.selectAll(`#${self.id} svg, #${self.id} .no-data`).remove();
    if (self.data && self.data.target && self.formatted.value >= 0) {
      const container = d3.select(`#${self.id} .svg-s`);
      const svg = container.append('svg').attr('height', size).attr('width', width);
      const svg1 = container.append('svg').attr('class', 'inset').attr('height', size).attr('width', width);
      const svg2 = container.append('svg').attr('class', 'outset').attr('height', size).attr('width', width);
      const g = svg.append('g');
      const g1 = svg1.append('g');
      const g2 = svg2.append('g');
      if (self.data) {
        if (Number(self.formatted.value) <= Number(self.data.target)) {
          g.append('path')
            .attr('class', 'outline')
            .datum({ endAngle: (self.data.target / self.data.target) * self.tau })
            .attr('d', arc1);
          g.append('path')
            .datum({ endAngle: (self.formatted.value / self.data.target) * self.tau })
            .attr('d', arc1);
        }
        if (Number(self.formatted.value) > Number(self.data.target)) {
          let first = (self.formatted.value / self.data.target);
          first = (first - Math.floor(first)) * self.data.target;
          g.append('path')
            .datum({ endAngle: (self.formatted.value / self.data.target) * self.tau })
            .attr('d', arc1);
          g1.append('path')
            .datum({ endAngle: (first / (self.data.target + 20)) * self.tau })
            .attr('class', 'inset')
            .attr('filter', 'url(#inset-shadow)')
            .attr('d', arc2);
          g2.append('path')
            .datum({ endAngle: (first / self.data.target) * self.tau })
            .attr('d', arc1);
        }
      }
    } else {
      self.appHelper.noData(this.id);
    }
  }
}
