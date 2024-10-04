import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { Console } from 'console';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin, ...registerables);
import jsPDF from 'jspdf';
import { AppServiceHelper } from 'src/app/helpers/app.helper.service';
import { CheckSideNavStatusService } from "src/app/services/check-side-nav-status.service";
import * as moment from 'moment';
declare const window: any;

@Component({
  selector: 'app-hbar',
  templateUrl: './hbar.component.html',
  styleUrls: ['./hbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HbarComponent implements OnInit, OnChanges {
  id: string;
  @ViewChild('hbar', { static: false }) element: ElementRef;
  @Input() data;
  @Input() xAxis;
  @Input() yAxis;
  @Input() yAxisLabel = ['', ''];
  @Input() keys;
  @Input() legends;
  @Input() colors = [];
  @Input() view;
  @Input() secondary;
  @Input() active = false;
  @Input() fromTime;
  @Input() toTime;
  @Input() titltName;
  @Input() showDateRangeInTitle;
  @Input() aspectRatio;
  @Input() isZoomPan;
  @Input() isResetZoom;
  @Input() isDownloadPng;
  @Input() isDownloadJpg;
  @Input() isDownloadPdf;
  @Input() titleSize;

  margin;
  width;
  height;
  chartObj: any;
  dataSet: any;
  labels: any;
  updatedFromTime: any;
  updatedToTime: any;
  data2;
  sideNavStatus: boolean;
  aspectRatiofactor = 1;
  @Input() isClickable = false;
  @Output() sendClickStatus = new EventEmitter();
  storeBarData;

  constructor(private appHelper: AppServiceHelper, private checkSideNavStatusService: CheckSideNavStatusService) {
    this.id = `id${appHelper.randomString(10)}`;
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
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
  }
  ngDoCheck(): void {
    if (this.sideNavStatus != this.checkSideNavStatusService.getSideNavStatus()) {
      this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
      this.definitions();
    }
  }
  definitions(event?) {
    var height3 = window.innerHeight;
    if (this.sideNavStatus) {
      this.aspectRatiofactor = 1.15;
    } else {
      this.aspectRatiofactor = 1;
    }

    const height2 = this.element.nativeElement.clientHeight; // this is to auto adjust the height of Y-axis -350
    const width2 = this.element.nativeElement.clientWidth;  // this is to auto adjust the height of X-axis - 752
    this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    this.width = width2;
    this.height = height2;
    // let lengthOfLables=this.data.legends
    // let customData=[10,80,40,50,80,30,40,50,80,30,50]
    // customData=customData.slice(0,lengthOfLables-1)

    this.labels = this.data.legends
    this.data2 = {
      labels: this.data.legends,
      datasets: [{
        axis: 'y',
        label: 'Energy Consumed kWh',
        data: this.data.data,
        fill: false,
        backgroundColor: this.data.colors,
        borderWidth: 1,
        borderColor: this.data.colors,
        /*barThickness: 35,*/
      }]
    };

    this.stacked();
  }

  /*shows the stacked bar graph.*/
  stacked() {
    const self = this;
    //var ctx = document.querySelector<HTMLElement>("#" + chartId) as HTMLCanvasElement;
    if (self.chartObj) {
      self.chartObj.destroy();
    }
    //const chart=self.chartObj
    self.chartObj = new Chart(self.id, {
      type: 'bar',
      data: this.data2,
      options: {
        indexAxis: 'y',
        responsive: true,
        aspectRatio: self.aspectRatio * this.aspectRatiofactor,
        maintainAspectRatio: true,
        scales: {
          x: {
            beginAtZero: true,
            stacked: false
          },
          y: {

            stacked: false
          },
        },
        onClick: (e, element, chart) => {
          if(self.isClickable === true) {
            if(element && element[0] && element[0]["element"]) {
              if(self.storeBarData != element[0]["element"]["$context"]["parsed"]["x"]) {
                self.storeBarData = element[0]["element"]["$context"]["parsed"]["x"];
                self.sendClickStatus.emit(["FILTER", chart.data.labels[element[0].index]]);
              } else {
                self.storeBarData = 0;
                self.sendClickStatus.emit(["UNFILTER" , chart.data.labels[element[0].index]]);
              }
            }
          }
        },
        plugins: {
          title: {
            display: false,
            text: self.titltName,
            color: '#000000',
            font: {
              size: self.titleSize,
              family: "'bosch-light'"
            },
            padding: 10
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              mode: 'y',

              drag: {
                enabled: true,
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1
              }
            },
            pan: {
              enabled: true,
              mode: 'x'
            }
          },
          legend: {
            labels: {
              usePointStyle: true,
            },
            display: false,
            position: 'bottom'
          },
          // legend: {
          //   labels: {
          //     generateLabels:(chartObj)=> {
          //       return chartObj.data.labels.map((label,index)=>{
          //         text:label,
          //         strokeStyle:chart.data.datasets[0].borderColor[index],
          //         fillStyle:chart.data.datasets[0].backgroundColor[index],
          //         hidden:false
          //       })
          //     },
          //   },
          // }
        },
        onHover: (element , chart) => {
          element["native"]["target"]["style"]["cursor"] = chart[0] ? 'pointer' : 'default';
        }
      }
    });

    this.disableFeature();

  }

  resetZoomedChart() {
    this.chartObj.resetZoom();
  }

  downloadImage(imageType: any) {
    const canvas = document.querySelector<HTMLElement>(`#${this.id}`) as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    context!.save();
    context!.globalCompositeOperation = 'destination-over';
    context!.fillStyle = '#FFFFFF';
    context!.fillRect(0, 0, canvas.width, canvas.height);
    context!.restore();

    const imageLink = document.createElement('a');
    imageLink.download = 'chart.' + imageType;
    imageLink.href = canvas.toDataURL('image/' + imageType, 1);
    imageLink.click();
  }

  downloadPdf() {
    const canvas = document.querySelector<HTMLElement>(`#${this.id}`) as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    context!.save();
    context!.globalCompositeOperation = 'destination-over';
    context!.fillStyle = '#FFFFFF';
    context!.fillRect(0, 0, canvas.width, canvas.height);
    context!.restore();
    const pdfName = 'chart.pdf';
    const canvasImage = canvas.toDataURL('image/jpeg', 1);
    //let pdf = new jsPDF('landscape');
    let pdf = new jsPDF('landscape');
    //pdf.setFontSize = 20;
    pdf.addImage(canvasImage, 'JPEG', 15, 15, 280, 150);
    pdf.save(pdfName);
  }

  disableFeature() {
    const nextValElement = document.getElementById('disable_feature');
    if (nextValElement != null) {
      const nextVal = nextValElement.getAttribute('value');

      if (nextVal == 'drag') {
        nextValElement.setAttribute('value', 'pan');
        nextValElement.setAttribute('class', 'boschicon-bosch-ic-zoom-in');
        nextValElement.setAttribute('title', 'Enable Zoom');
        this.chartObj.options.plugins.zoom.pan.enabled = true;
        this.chartObj.options.plugins.zoom.pan.mode = 'x';
        this.chartObj.options.plugins.zoom.zoom.drag.enabled = false
        this.chartObj.update();
      } else {
        nextValElement.setAttribute('value', 'drag');
        nextValElement.setAttribute('class', 'boschicon-bosch-ic-compare');
        nextValElement.setAttribute('title', 'Enable Drag');
        this.chartObj.options.plugins.zoom.pan.enabled = false
        this.chartObj.options.plugins.zoom.zoom.drag.enabled = true
        this.chartObj.options.plugins.zoom.zoom.drag.backgroundColor = 'rgba(255,99,132,0.2)';
        this.chartObj.options.plugins.zoom.zoom.drag.borderColor = 'rgba(255,99,132,1)';
        this.chartObj.options.plugins.zoom.zoom.drag.borderWidth = 1;
        this.chartObj.update();
      }
    }
  }

}
