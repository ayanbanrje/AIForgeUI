import {
  Component,
  OnInit,
  OnChanges,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  DoCheck,
} from "@angular/core";
import * as d3 from "d3";
import * as _ from "lodash";
import { AppServiceHelper } from "src/app/helpers/app.helper.service";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin, ...registerables);
import jsPDF from "jspdf";
import { CheckSideNavStatusService } from "src/app/services/check-side-nav-status.service";
import { Router } from "@angular/router";
declare const window: any;
@Component({
  selector: "app-multi-line",
  templateUrl: "./multi-line.component.html",
  styleUrls: ["./multi-line.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class MultiLineComponent implements OnInit, OnChanges, DoCheck {
  @ViewChild("graph", { static: false }) element: ElementRef;
  id: string = "";
  @Input() data;
  @Input() color = [];
  @Input() multilineLegends;
  @Input() yAxis = [];
  @Input() xAxis;
  @Input() view;
  @Input() unit;
  @Input() chartId;
  @Input() titleName;
  @Input() titleSize;
  @Input() showDateRangeInTitle;
  @Input() isZoomPan;
  @Input() isResetZoom;
  @Input() isDownloadPng;
  @Input() isDownloadJpg;
  @Input() isDownloadPdf;
  @Input() positionRelative;
  @Input() multiLineChartNum;
  @Input() AQImultiLineChartNum;
  @Input() aspectRatio;
  @Input() maxTick;
  @Input() graphWidth;
  @Input() showLabel;
  @Input() maintainAspectRatioFlag = true;
  @Input() dashboardFlag = false;
  @Input() factorCondition: boolean = false;
  @Input() controlXAxisFontSize: boolean = false;
  @Input() stepSize = null;
  @Input() graphFeatureFlag = true;
  aspectRatiofactor = 1;
  customScale;
  customLegend;
  customTitle;
  format = "%H:%M";
  ticks = 5;
  margin;
  width;
  height;
  x;
  y;
  svg;
  valueLine;
  curve = d3.curveMonotoneX;
  colors = d3.scaleOrdinal(d3.schemeCategory10);
  yDomain;
  legendSpace: number;
  yMax = 0;
  yMin = 0;
  rangeX = 20; // 60 if yAxis
  config: any;
  myChart;
  noDataFlag = true;
  showTitle: number = 0;
  sideNavStatus: boolean;
  isTickReduced = false;
  zoomID = "";
  @Input() dataFrom = "";
  @Output() sendDownloadData = new EventEmitter();
  @Input() chartName = "";
  @Input() hideLegend = false;
  @Input() batteryStatus = false;
  @Input() status = false;
  customeTooltip;
  @Input() isDownloadExcel = false;
  @Input() excelName = "";
  @Input() excelData = [];

  constructor(
    private appHelper: AppServiceHelper,
    private checkSideNavStatusService: CheckSideNavStatusService,
    private router: Router
  ) {
    this.id = `id${appHelper.randomString(10)}`;
    this.zoomID = `${appHelper.randomString(10)}`;
  }

  ngOnInit() {
    const self = this;
    window.setTimeout(() => {
      self.definition();
    }, 100);
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
  }

  ngOnChanges() {
    this.id = `id${this.appHelper.randomString(10)}`;
    this.zoomID = `${this.appHelper.randomString(10)}`;
    const self = this;
    window.setTimeout(() => {
      self.definition();
    }, 100);
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
  }
  ngDoCheck(): void {
    if (
      this.sideNavStatus != this.checkSideNavStatusService.getSideNavStatus()
    ) {
      this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
      this.definition();
    }

    if (
      this.dataFrom === "0" &&
      this.checkSideNavStatusService.getIsEPDownload()
    ) {
      const canvas = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
      let parentData = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement["parentElement"];
      let formatedData = [];
      this.myChart["data"]["labels"].map((m, i) => {
        let newObj = {};
        newObj["Time"] = m;
        this.myChart["data"]["datasets"].map((g, j) => {
          newObj[g.label] = g.data[i];
        });
        formatedData.push(newObj);
      });
      this.sendDownloadData.emit([
        canvas,
        context,
        parentData,
        this.myChart["data"],
        this.myChart["data"]["labels"],
        formatedData,
        this.chartName,
      ]);
      this.checkSideNavStatusService.setIsEPDownload(false);
    }
  }
  definition() {
    // this.myChart ? this.myChart.destroy() : null;
    if (this.myChart) {
      this.myChart.destroy();
    }

    // const self = this;
    // const height = self.element.nativeElement.clientHeight;
    // const width = self.element.nativeElement.clientWidth;
    // self.margin = { top: 5, right: 5, bottom: 5, left: 5 };
    // self.width = width - self.margin.left - self.margin.right;
    // self.height = height - self.margin.top - self.margin.bottom;

    var height3 = window.innerHeight;
    if (height3 >= 1000 && this.factorCondition) {
      if (this.sideNavStatus) {
        this.aspectRatiofactor = 0.9;
      } else {
        this.aspectRatiofactor = 0.8;
      }
    } else {
      if (this.sideNavStatus) {
        this.aspectRatiofactor = 1.15;
      } else {
        this.aspectRatiofactor = 1;
      }
    }

    // if (height3 <= 800 && this.factorCondition) {
    //   if (this.sideNavStatus) {
    //     this.aspectRatiofactor = 1.06;
    //   } else {
    //     this.aspectRatiofactor = 0.87;
    //   }
    // } else {
    //   if (this.sideNavStatus) {
    //     this.aspectRatiofactor = 1.22;
    //   } else {
    //     this.aspectRatiofactor = 1;
    //   }
    // }

    if (window.innerWidth <= 768 && this.factorCondition) {
      this.aspectRatiofactor = 1;
      if (this.multiLineChartNum === 1 || this.multiLineChartNum === 2) {
        this.aspectRatio = 2.5;
      } else if (this.dashboardFlag == true) {
        this.aspectRatio = 2;
      } else {
        this.aspectRatio = 1;
      }
    }

    if (this.controlXAxisFontSize) {
      var OSName = "Unknown OS";
      if (navigator.platform.indexOf("Win") != -1) OSName = "Windows";
      if (navigator.platform.indexOf("Mac") != -1) OSName = "MacOS";
      if (navigator.platform.indexOf("X11") != -1) OSName = "UNIX";
      if (navigator.platform.indexOf("Linux") != -1) OSName = "Linux";

      if (
        OSName == "Windows" &&
        height3 < 1000 &&
        this.isTickReduced === false
      ) {
        this.maxTick = this.maxTick - 1;
        this.isTickReduced = true;
      }
    }

    if (this.titleName) {
      this.showTitle = 1;
    }

    // Function to resize the canvas text
    const vw = (v) => {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      if (window.innerWidth >= 768) {
        return (v * vw) / 100;
      } else {
        v = 2.5;
        if (typeof this.dashboardFlag !== "undefined" && this.dashboardFlag) {
          v = 2;
        }
        return (v * vw) / 100;
      }
    };

    if (this.multiLineChartNum == 1) {
      this.customScale = {
        x: {
          beginAtZero: true,
          grid: {
            display: true,
            drawBorder: true,
          },
          ticks: {
            font: {
              family: "bosch-Medium",
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
        },
        y: {
          display: true,
          position: "right",
          ticks: {
            maxTicksLimit: 2,
            font: {
              family: "bosch-Medium",
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
          title: {
            display: true,
            text: "Humidity",
            font: {
              family: "bosch-Medium",
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
            // color: 'black',
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y1: {
          display: true,
          position: "left",
          ticks: {
            maxTicksLimit: 2,
            font: {
              family: "bosch-Medium",
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
          title: {
            display: true,
            text: "Temperature",
            font: {
              family: "bosch-Medium",
              style: "normal",
              size: vw(0.75),
              weight: "bold",
            },
          },
          grid: {
            drawBorder: false,
            display: false,
          },
        },
      };
      this.customLegend = {
        labels: {
          usePointStyle: true,
          font: {
            size: vw(0.75),
          },
        },
        display: false,
        position: "bottom",
      };
      this.customTitle = {
        display: this.showTitle,
        text: this.titleName,
        color: "#008ecf",
        font: {
          size: this.titleSize,
          family: "'bosch-light'",
        },
        padding: 10,
      };
    }
    if (this.multiLineChartNum == 2) {
      this.customScale = {
        x: {
          beginAtZero: true,
          grid: {
            display: true,
            drawBorder: true,
          },
          ticks: {
            font: {
              family: "bosch-Medium",
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
        },
        y: {
          display: true,
          position: "left",
          beginAtZero: true,
          ticks: {
            maxTicksLimit: 2,
            font: {
              family: "bosch-Medium",
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
          title: {
            display: true,
            text: "AQI",
            font: {
              family: "bosch-Medium",
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
            // color: 'black',
          },
          grid: {
            display: true,
            drawBorder: true,
          },
        },
      };
      this.customLegend = {
        labels: {
          usePointStyle: true,
          font: {
            size: vw(0.75),
          },
        },
        display: false,
        position: "bottom",
      };
      this.customTitle = {
        display: this.showTitle,
        text: this.titleName,
        color: "#008ecf",
        font: {
          size: this.titleSize,
          family: "'bosch-light'",
        },
        padding: 10,
      };
    } else if (this.multiLineChartNum == 3) {
      this.customScale = {
        x: {
          ticks: {
            display: true,
            autoSkip: true,
            maxTicksLimit: this.maxTick,
            maxRotation: 0,
            minRotation: 0,
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
        },
        y: {
          beginAtZero: true,
          ticks: {
            beginAtZero: true,
            stepSize: this.stepSize ? this.stepSize : null,
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
        },
      };
      if (this.showLabel == 1) {
        this.customLegend = {
          labels: {
            usePointStyle: true,
            font: {
              size: vw(0.75),
            },
          },
          display: true,
          position: "bottom",
        };
      } else {
        this.customLegend = {
          display: false,
        };
      }

      this.customTitle = {
        display: this.showTitle,
        text: this.titleName,
        color: "#000000",
        font: {
          size: this.titleSize,
          family: "'bosch-Regular'",
        },
        padding: 10,
      };
    }

    if(this.hideLegend) {
      this.customLegend = {
        display: false,
      };
      const self = this;
      this.customScale = {
        x: {
          ticks: {
            display: true,
            autoSkip: true,
            maxRotation: 0,
            minRotation: 0,
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
        },
        y: {
          display: true,
          ticks: {
            callback: function (i, tickValue, index, tick) {
              let formatedTicks = "";
              if (Number(i) === 0) {
                formatedTicks = "Offline";
              } else if (Number(i) === 1) {
                formatedTicks = "Online";
              } else {
                formatedTicks = "";
              }
              return self.batteryStatus
                ? Number(i) == 0
                  ? `${Number(i)}.00%`
                  : Number(i) % 10 === 0
                  ? `${Number(i)}.00%`
                  : `${Number(i) * 100}.00%`
                : formatedTicks;
            },
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          }
        },
      }

      const formatedLabel = (tooltipItems) => {
          let status =this.batteryStatus ? `${Number(tooltipItems.raw).toFixed(2)} %` : tooltipItems.raw === 0 ? "Offline" : "Online"
        return `${tooltipItems.dataset.label}: ${status}` ;
      };

      this.customeTooltip = {
        callbacks: {
          label: formatedLabel,
        },
        bodyFont: {
          size: vw(0.75)
        }
      };
    }

    this.config = {
      type: "line",
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: this.maintainAspectRatioFlag,
        aspectRatio: this.aspectRatio * this.aspectRatiofactor,
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: this.customScale,
        plugins: {
          decimation: {
            algorithm: "lttb",
            enabled: true,
            samples: 4,
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              drag: {
                enabled: true,
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
              },
              mode: "x",
            },
            pan: {
              enabled: true,
              mode: "x",
            },
          },
          legend: this.customLegend,
          title: this.customTitle,
          tooltip: this.customeTooltip
        },
        onHover: (element, chart) => {
          element["native"]["target"]["style"]["cursor"] = chart[0]
            ? "pointer"
            : "default";
        },
      },
    };

    var ctx = document.querySelector<HTMLElement>(
      `#${this.id}`
    ) as HTMLCanvasElement;
    this.myChart = new Chart(this.id, this.config);
    this.noDataFlag = false;
    this.disableFeature();
  }

  timeFormatter() {
    if (this.view) {
      this.format = "%H:%M";
      if (this.view === "daily" || this.view === "weekly") {
        // this.format = '%d %b';
        this.format = "%H:%M";
      }
      if (this.view === "monthly") {
        // this.format = '%B';
        this.format = "%H:%M";
      }
    }
  }

  noData() {
    const self = this;
    d3.selectAll(`#${self.id} svg, #${self.id} .no-data`).remove();
    this.svg = d3.select(`#${self.id}`).append("div").attr("class", "no-data");
    this.svg.append("i").attr("class", "boschicon-bosch-ic-data-loss");
    this.svg.append("label").attr("class", "no-data").text("No Data");
  }

  resetZoomedChart() {
    this.myChart.resetZoom();
  }

  downloadImage(imageType: any) {
    const canvas = document.querySelector<HTMLElement>(
      `#${this.id}`
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    context!.save();
    context!.globalCompositeOperation = "destination-over";
    context!.fillStyle = "#FFFFFF";
    context!.fillRect(0, 0, canvas.width, canvas.height);
    context!.restore();

    const imageLink = document.createElement("a");
    imageLink.download = "chart." + imageType;
    imageLink.href = canvas.toDataURL("image/" + imageType, 1);
    imageLink.click();
  }

  downloadPdf() {
    const canvas = document.querySelector<HTMLElement>(
      `#${this.id}`
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    context!.save();
    context!.globalCompositeOperation = "destination-over";
    context!.fillStyle = "#FFFFFF";
    context!.fillRect(0, 0, canvas.width, canvas.height);
    context!.restore();
    const pdfName = "chart.pdf";
    const canvasImage = canvas.toDataURL("image/jpeg", 1);
    //let pdf = new jsPDF('landscape');
    let pdf = new jsPDF("landscape");
    //pdf.setFontSize = 20;
    pdf.addImage(canvasImage, "JPEG", 15, 15, 280, 150);
    pdf.save(pdfName);
  }

  disableFeature() {
    if (this.isZoomPan) {
      const nextValElement = document.getElementById(this.zoomID);
      if (nextValElement != null) {
        const nextVal = nextValElement.getAttribute("value");
        if (nextVal == "drag") {
          nextValElement.setAttribute("value", "pan");
          nextValElement.setAttribute("class", "boschicon-bosch-ic-zoom-in");
          nextValElement.setAttribute("title", "Enable Zoom");
          this.myChart.options.plugins.zoom.pan.enabled = true;
          this.myChart.options.plugins.zoom.pan.mode = "x";
          this.myChart.options.plugins.zoom.zoom.drag.enabled = false;
          this.myChart.update();
        } else {
          nextValElement.setAttribute("value", "drag");
          nextValElement.setAttribute("class", "boschicon-bosch-ic-compare");
          nextValElement.setAttribute("title", "Enable Drag");
          this.myChart.options.plugins.zoom.pan.enabled = false;
          this.myChart.options.plugins.zoom.zoom.drag.enabled = true;
          this.myChart.options.plugins.zoom.zoom.drag.backgroundColor =
            "rgba(255,99,132,0.2)";
          this.myChart.options.plugins.zoom.zoom.drag.borderColor =
            "rgba(255,99,132,1)";
          this.myChart.options.plugins.zoom.zoom.drag.borderWidth = 1;
          this.myChart.update();
        }
      }
    } else {
      this.myChart.options.plugins.zoom.pan.enabled = true;
      this.myChart.options.plugins.zoom.pan.mode = "x";
      this.myChart.options.plugins.zoom.zoom.drag.enabled = false;
      this.myChart.update();
    }
  }
}
