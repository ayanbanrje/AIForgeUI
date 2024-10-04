import { Component, DoCheck, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { AppServiceHelper } from 'src/app/helpers/app.helper.service';
import { CheckSideNavStatusService } from 'src/app/services/check-side-nav-status.service';
import { Chart, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin, ...registerables);

@Component({
  selector: 'app-grouped-mixed-bar',
  templateUrl: './grouped-mixed-bar.component.html',
  styleUrls: ['./grouped-mixed-bar.component.scss']
})
export class GroupedMixedBarComponent implements OnInit, OnChanges, DoCheck {
  id: string;
  sideNavStatus: boolean;
  chartObj: any;
   @Input() chartType = "mixed" || "grouped";
  @Input() data = [];
  @ViewChild("stack", { static: false }) element: ElementRef;
  @Input() xAxis;
  @Input() yAxis;
  @Input() yAxisLabel = ["", ""];
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
  @Input() factorCondition: boolean = false;
  @Input() stepSize = null;
  margin;
  width;
  height;
  dataSet: any;
  @Input() labels: any;
  updatedFromTime: any;
  updatedToTime: any;
  aspectRatiofactor = 1;
  @Input() isLegendViible = true;
  @Input() nameLabels = [];
  @Input() seriesChartData = [];
  @Input() simpleBar = false;
  @Input() isClickable = false;
  @Input() customToolTip = false;
  @Input() categoryWiseTotal = [];
  @Input() selectedCategory = "";
  @Input() hideXLabels = false;
  @Input() zoomLevel = 0;
  @Output() sendClickStatus = new EventEmitter();
  storeBarData;
  storeIndex;
  @Input() maintainAspectRatio = true;
  @Input() hasTitle = true;
  @Input() isVisible = true;
  @Input() mixedChart = false;
  @Input() mixedChartLabel = "";
  @Input() mixedChartAvgArr = [];
  @Output() sendDownloadData = new EventEmitter();
  @Input() chartName = "";

  constructor(
    private appHelper: AppServiceHelper,
    private checkSideNavStatusService: CheckSideNavStatusService
    ) {
    this.id = `id${appHelper.randomString(10)}`;
   }
   
  ngDoCheck() {
    if(this.checkSideNavStatusService.getIsEUIDownload()) {
      const canvas = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
      let parentData = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement["parentElement"];
      let dataArr = [];
      this.chartObj["data"]["datasets"][0].data.map((k,i) => {
        dataArr.push({
          Energy_consumption: `${k} kWh`,
          Energy_Use_Intensity: `${this.chartObj["data"]["datasets"][1].data[i]} kWh/sq.ft`,
        });
      });
      this.sendDownloadData.emit([canvas,context, parentData, this.chartObj["data"], this.chartObj["data"]["labels"], dataArr, this.chartName]);
      this.checkSideNavStatusService.setIsEUIDownload(false);
    }
  }

  ngOnInit(): void {
    this.id = `id${this.appHelper.randomString(10)}`;
    const self = this;
    window.setTimeout(() => {
      self.createChart();
    }, 100);
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
  }

  ngOnChanges() {
    this.id = `id${this.appHelper.randomString(10)}`;
    const self = this;
    window.setTimeout(() => {
      self.createChart();
    }, 100);
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
  }

  createChart() {
    const self = this;
    if (self.chartObj) {
      self.chartObj.destroy();
    }

    let data;
    data = this.dataForGruopChart();

    this.chartObj = new Chart(this.id, data);
  }

  dataForGruopChart() {
    var data = {
      labels : this.labels,
      datasets : [
        {
          label : "Energy consumption",
          data : this.data[0],
          backgroundColor : [
            "#0978AF"
          ],
          borderColor : [
            "#0978AF"
          ],
          borderWidth : 1,
          barThickness: 10
        },
        {
          label : "Energy Use Intensity",
          data : this.data[1],
          backgroundColor : [
            "#9e2896"
          ],
          borderColor : [
            "#9e2896"
          ],
          borderWidth : 1,
          yAxisID: 'y1',
          barThickness: 10
        }
      ]
    };

    // Function to resize the canvas text
    function vw(v) {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0); 
      if(window.innerWidth >= 768) {
        return (v * vw) / 100;
      } else {
        v = 2.5;
        return (v * vw) / 100;
      }
    }
  
    var options = {
      aspectRatio: 3,
      barPercentage: 1,
      plugins:{
        legend : {
          display: true,
          position : "bottom",
          labels: {
            usePointStyle: true,
            font:{
              size: vw(0.75)
            }
          },
        },
        title : {
          display : false,
          position : "bottom",
          text : "Bar Graph",
          fontSize : 18,
          fontColor : "#111"
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: false,
            },
            drag: {
              enabled: true,
              backgroundColor: "rgba(255,99,132,0.2)",
              borderColor: "rgba(255,99,132,1)",
              borderWidth: 1,
            },
            mode: 'x',
          },
          pan: {
            enabled: true,
            mode: 'x',
          }
        },
      },
      scales : {
        x: {
          ticks: {
            display: true,
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Energy consumption, kWh',
            font: {
              size: vw(0.65),
              family: "'bosch-Regular'",
            },
            color: 'black',
          },
          ticks: {
            display: true,
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
            count:  (ctx) => {
              return 8;
            }
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          // max: (ctx) => {
          //   return ctx?.chart?.scales?.y?.max;
          // },
          // min: (ctx) => {
          //   return ctx?.chart?.scales?.y?.min;
          // },
          title: {
            display: true,
            text: 'Energy Intensity,kWh/Area', //Energy Use Intencity, kWh per Area
            color: 'black',
            font: {
              size: vw(0.65),
              family: "'bosch-Regular'",
            },
          },
          ticks: {
            display: true,
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
            count:  (ctx) => {
              // ctx?.chart?.scales?.y?.ticks.length
                return 8;
              }
          },
        },
      }
    };

    let configs = {
      type: 'bar',
      data,
      options: options
    };

    return configs;
  }
}
