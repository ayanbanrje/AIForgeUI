import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { JsonService } from 'src/app/services/json.service';
declare const window: any;

@Component({
  selector: 'app-d3-global-map',
  templateUrl: './d3-global-map.component.html',
  styleUrls: ['./d3-global-map.component.scss']
})
export class D3GlobalMapComponent implements OnInit, OnChanges {
  @ViewChild('d3globalmap', { static: false }) element: ElementRef;
  id = `id` + this.randomString(10);
  // @Input() public myName;
  width;
  height;
  margin;
  projection;
  zoom;
  path;
  svg;
  g; // to group svg
  initX;
  mouseClicked = false;
  s = 1; // using for mouse click counts for zoom function
  rotated = 90;
  mouse;
  public world: any = [];
  public cities: any = [];
  markers = [
    { long: 4, lat: 5 }, // corsica
    // { long: 36, lat: 138 }, // nice
    // { long: 2.349, lat: 48.864 }, // Paris
    // { long: -1.397, lat: 43.664 }, // Hossegor
    // { long: 3.075, lat: 50.640 }, // Lille
    { long: -3.83, lat: 58 }, // Morlaix
    { long:  28.38, lat: 77.12 }, // India
  ];
  constructor(private MapService: JsonService) { }

  ngOnInit() {
    this.load();
  }
  ngOnChanges() {
    this.load();
  }

  // load() {
  //   const self = this;
  //   self.MapService.getWorldData()
  //     .subscribe(worldData => {
  //       self.world = worldData;
  //       window.setTimeout(() => {
  //         self.definition();
  //       }, 100);
  //     });
  // }
  load() {
    const self = this;
    self.MapService.getWorldData()
      .subscribe(worldData => {
        self.world = worldData;
        window.setTimeout(() => {
          self.definition();
        }, 100);
        self.MapService.getCitiesData().subscribe(worldCities => {
          self.cities = worldCities;
          window.setTimeout(() => {
            self.definition();
          }, 100);
        });
      });
  }
  definition() {
    const self = this;
    const height = this.element.nativeElement.clientHeight - 130;
    const width = this.element.nativeElement.clientWidth;
    this.margin = { top: 20, right: 20, bottom: 30, left: 20 },
      this.width = width - this.margin.left - this.margin.right,
      this.height = height - this.margin.top - this.margin.bottom;

    this.projection = d3.geoMercator()
      .translate([width / 2, height / 2])
      .scale((width - 1) / 2 / Math.PI);
    this.zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', function () {
        self.zoomed(self, this);
      })
      .on('end', this.zoomended);

    this.path = d3.geoPath()
      .projection(this.projection);

    this.loadnewmap();
  }
  zoomended() {
    if (this.s !== 1) {
      return;
    }
    this.rotated = this.rotated + ((this.mouse[0] - this.initX) * 360 / (this.s * this.width));
    this.mouseClicked = false;
  }
  zoomed(self, element) {
    const t = [d3.event.transform.x, d3.event.transform.y];
    this.s = d3.event.transform.k;
    const h = 0;
    t[0] = Math.min(
      (this.width / this.height) * (this.s - 1),
      Math.max(this.width * (1 - this.s), t[0])
    );
    t[1] = Math.min(
      h * (this.s - 1) + h * this.s,
      Math.max(this.height * (1 - this.s) - h * this.s, t[1])
    );
    this.g.attr('transform', 'translate(' + t + ')scale(' + this.s + ')');
    d3.selectAll('.boundary').style('stroke-width', 1 / this.s);
    this.mouse = d3.mouse;
    if (this.s === 1 && this.mouseClicked) {
      this.rotateMap(this.mouse[0]);
      return;
    }
  }
  rotateMap(endX) {
    this.projection.rotate([this.rotated + (endX - this.initX) * 360 / (this.s * this.width), 0, 0]);
    this.g.selectAll('path').attr('d', this.path);
  }
  randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  // for drawing map
  loadnewmap() {
    const self = this;
    d3.select(`#${self.id} svg, #${self.id} .no-data`).remove();
    self.svg = d3.select(`#${self.id}`).append('svg')
      .attr('width', self.width + self.margin.left + self.margin.right)
      .attr('height', self.height + self.margin.top + self.margin.bottom)
      .on('wheel', function () {
        self.initX = d3.mouse(this)[0];
      })
      .on('mousedown', function () {
        if (self.s !== 1) {
          return;
        }
        self.initX = d3.mouse(this)[0];
        self.mouseClicked = true;
      })
      .call(self.zoom)
      .append('g')
      .attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')');
    this.g = this.svg.append('g');

    // this.svg.append('rect')
    //   .attr('class', 'overlay')
    //   .attr('fill', 'none')
    //   .attr('width', this.width)
    //   .attr('height', this.height);


    // this.g.append('path')
    //   .datum({ type: 'Sphere' })
    //   .attr('class', 'sphere')
    //   .attr('fill', 'rgba(0,0,0,0)')
    //   .attr('d', this.path);

    // this.g.append('path')
    //   .datum(topojson.merge(this.world, this.world.objects.countries.geometries))
    //   .attr('class', 'land')
    //   .attr('fill', 'rgba(255,255,255,0.3)')
    //   .attr('d', this.path);

    // this.g
    //   .selectAll('myCircles')
    //   .data(this.markers)
    //   .enter()
    //   .append('circle')
    //     .attr('cx',  (d) => {
    //        return this.projection([d.long, d.lat])[0];
    //       // return 10;
    //       })
    //     .attr('cy', (d) => {
    //         // return 10;
    //         return this.projection([d.long, d.lat])[1];
    //      })
    //     .attr('r', 14)
    //     .style('fill', 'red')
    //     // .attr('stroke', '#69b3a2')
    //     // .attr('stroke-width', 1)
    //     .attr('fill-opacity', .4);
    this.g.append('path')
      .datum(topojson.merge(this.world, this.world.objects.countries.geometries))
      .attr('class', 'land')
      .attr('fill', 'rgba(255,255,255,0.3)')
      .attr('d', this.path);

    this.g
      .selectAll('myCircles')
      .data(this.cities)
      .enter()
      .append('circle')
        .attr('cx',  (d) => {
           return this.projection([d.lon, d.lat])[0];
          // return 10;
          })
        .attr('cy', (d) => {
            // return 10;
            return this.projection([d.lon, d.lat])[1];
         })
        .attr('r', 14)
        .style('fill', 'red')
        // .attr('stroke', '#69b3a2')
        // .attr('stroke-width', 1)
        .attr('fill-opacity', .4);



    this.g.append('path')
      .datum(topojson.mesh(this.world, this.world.objects.countries, (a, b) => {
        return a !== b;
      }))
      .attr('class', 'boundary')
      .attr('fill', 'none')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('vector-effect', 'non-scaling-stroke')
      .attr('d', this.path);
  }
}
