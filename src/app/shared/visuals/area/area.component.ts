import {
  Component,
  OnInit,
  OnChanges,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  DoCheck,
} from "@angular/core";
import { Chart, registerables } from "chart.js";
import { TranslateService } from "@ngx-translate/core";
Chart.register(...registerables);
import ZoomPlugin from "chartjs-plugin-zoom";
import { CheckSideNavStatusService } from "src/app/services/check-side-nav-status.service";
import jsPDF from "jspdf";
import { AppServiceHelper } from "src/app/helpers/app.helper.service";
Chart.register(ZoomPlugin);
declare const window: any;

@Component({
  selector: "app-area",
  templateUrl: "./area.component.html",
  styleUrls: ["./area.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AreaComponent implements OnInit, OnChanges, DoCheck {
  @Input() data;
  @Input() eventData;
  @Input() xAxis;
  @Input() yAxis;
  @Input() yAxisLabel = [];
  @Input() averageLine = 0;
  @Input() areacolor;
  @Input() basiccolor;
  @Input() legends;
  @Input() backgroundtooltip;
  @Input() view;
  @Input() status;
  @Input() statusColor;
  @Input() titltName;
  @Input() aspectRatio;
  @Input() screenType: "RTM" | "RAA" = "RAA";
  @Input() titleSize;
  @Input() factorCondition: boolean = false;
  @Input() resetZoom = false;
  @Input() stepSize = null;
  aspectRatiofactor = 1;
  lineChartGraph;
  updatedFromTime;
  updatedToTime;
  title;
  sideNavStatus: boolean;
  @Input() maintainAspectRatio = true;
  @Input() hasTitle = true;
  id: string;
  @Input() isVisible = true;
  @Input() hasModifiedLegend = true;
  @Input() hasLegend = true;
  @Input() customAverageText = false;
  @Input() averageText = "";
  @Input() averageArray = [];
  @Input() dataFrom = "";
  @Output() sendDownloadData = new EventEmitter();
  @Input() chartName = "";

  constructor(
    private translate: TranslateService,
    private checkSideNavStatusService: CheckSideNavStatusService,
    private appHelper: AppServiceHelper
  ) {
    this.id = `id${appHelper.randomString(10)}`;
  }

  ngOnInit() {
    window.setTimeout(() => {
      this.definitions();
    }, 200);
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
  }

  ngOnChanges() {
    window.setTimeout(() => {
      this.definitions();
    }, 100);
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
  }
  ngDoCheck(): void {
    if (
      this.sideNavStatus != this.checkSideNavStatusService.getSideNavStatus()
    ) {
      this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
      //console.log("sideNavStatus", this.sideNavStatus)
      this.definitions();
    }
    if(this.dataFrom === '0' && this.checkSideNavStatusService.getIsDownload()) {
      const canvas = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement;
      let parentData = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement["parentElement"];
      const context = canvas?.getContext("2d");
      if(
        canvas &&
        context &&
        this.lineChartGraph &&
        this.lineChartGraph["data"] &&
        this.lineChartGraph["data"]["labels"] &&
        this.lineChartGraph["data"]["datasets"]
      ) {
        this.sendDownloadData.emit([canvas, context, parentData, this.lineChartGraph["data"], this.lineChartGraph["data"]["labels"], this.lineChartGraph["data"]["datasets"][1]["data"], this.chartName]);
      }
      this.checkSideNavStatusService.setIsDownload(false);
    }
    
    if(this.dataFrom === '1' && this.checkSideNavStatusService.getIsCLECRdownload()) {
      const canvas = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement;
      let parentData = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement["parentElement"];
      const context = canvas?.getContext("2d");
      if(
        canvas &&
        context &&
        this.lineChartGraph &&
        this.lineChartGraph["data"] &&
        this.lineChartGraph["data"]["labels"] &&
        this.lineChartGraph["data"]["datasets"]
      ) {
        this.sendDownloadData.emit([canvas, context, parentData, this.lineChartGraph["data"], this.lineChartGraph["data"]["labels"], this.lineChartGraph["data"]["datasets"][1]["data"], this.chartName]);
      }
      this.checkSideNavStatusService.setIsCLECRdownload(false);
    }
  }
  definitions() {
    // var height3 = window.innerHeight;
    // if(height3>=1000 && this.factorCondition){
    //   this.aspectRatiofactor=0.775;
    // }
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
    if (height3 <= 800 && this.factorCondition) {
      if (this.sideNavStatus) {
        this.aspectRatiofactor = 1.06;
      } else {
        this.aspectRatiofactor = 0.87;
      }
    } else {
      if (this.sideNavStatus) {
        this.aspectRatiofactor = 1.22;
      } else {
        this.aspectRatiofactor = 1;
      }
    }

    if (window.innerWidth <= 768 && this.factorCondition) {
      this.aspectRatiofactor = 1;
      this.aspectRatio = 1;
    }

    let xAxisValues;
    if (this.data) {
      if (this.view === "minute" || this.view === "hour") {
        if (this.screenType === "RAA") {
          xAxisValues = this.data.map(
            (item) =>
              `${this.padTo2Digits(
                new Date(item[this.xAxis]).getDate()
              )} ${this.padTo2Digits(
                new Date(item[this.xAxis]).toLocaleString("default", {
                  month: "short",
                })
              )} ${this.padTo2Digits(
                new Date(item[this.xAxis]).getHours()
              )}:${this.padTo2Digits(new Date(item[this.xAxis]).getMinutes())}`
          );
        } else {
          xAxisValues = this.data.map(
            (item) =>
              `${this.padTo2Digits(
                new Date(item.DEVICE_TIME).getHours()
              )}:${this.padTo2Digits(new Date(item.DEVICE_TIME).getMinutes())}`
          );
        }
      } else if (this.view === "daily" || this.view === "weekly") {
        xAxisValues = this.data.map(
          (item) =>
            `${this.padTo2Digits(
              new Date(item.DEVICE_TIME).getDate()
            )} ${this.padTo2Digits(
              new Date(item.DEVICE_TIME).toLocaleString("default", {
                month: "short",
              })
            )}`
        );
      } else if (this.view === "monthly") {
        xAxisValues = this.data.map(
          (item) =>
            `${this.padTo2Digits(
              new Date(item.DEVICE_TIME).toLocaleString("default", {
                month: "long",
              })
            )}`
        );
      }
      let aveargeArray = [];
      this.data.forEach(() => {
        aveargeArray.push(this.averageLine);
      });
      this.title = this.titltName;
      if (isNaN(this.averageLine)) {
        this.averageLine = 0;
      } else if (this.averageLine === null) {
        this.averageLine = 0;
      }
      let Average_Energy_Consumption = "Average Energy Consumption";
      let Actual_Energy_Consumption = "Actual Energy Consumption";
      Actual_Energy_Consumption = "Actual Energy Consumption";
      if (this.customAverageText) {
        Average_Energy_Consumption = this.averageText;
      } else {
        Average_Energy_Consumption = "Average Energy Consumption";
      }
      let labels = [];
      if (this.hasModifiedLegend) {
        labels = [
          `${Average_Energy_Consumption} (${this.averageLine.toFixed(2)})`,
          `${Actual_Energy_Consumption}`,
        ];
      } else {
        labels = [
          `${Average_Energy_Consumption}`,
          `${Actual_Energy_Consumption}`,
        ];
      }
      this.createLineChart(
        xAxisValues,
        this.data,
        this.averageArray.length > 0 ? this.averageArray : aveargeArray,
        this.title,
        labels,
        this.aspectRatio
      );
    }
  }

  padTo2Digits(date) {
    return String(date).padStart(2, "0");
  }

  createLineChart(xAxisValues, data, aveargeArray, title, labels, aspectRatio) {
    if (this.lineChartGraph) {
      this.lineChartGraph.destroy();
    }

    // Function to resize the canvas text
    function vw(v) {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      if (window.innerWidth >= 768) {
        return (v * vw) / 100;
      } else {
        v = 2.5;
        return (v * vw) / 100;
      }
    }

    this.lineChartGraph = new Chart(this.id, {
      type: "line",
      data: {
        labels: xAxisValues,
        datasets: [
          {
            label: labels[0],
            data: aveargeArray,
            backgroundColor: this.basiccolor.averageColor,
            borderColor: this.basiccolor.averageColor,
            borderWidth: 1,
            tension: 0.5,
            pointStyle: "circle",
            pointRadius: 1,
          },
          {
            label: labels[1],
            data: data.map((item) => item.ENERGY),
            backgroundColor: this.areacolor,
            borderColor: this.areacolor,
            borderWidth: 1,
            fill: {
              target: "origin",
              above: this.areacolor,
            },
            tension: 0.5,
            pointStyle: "circle",
            pointRadius: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            ticks: {
              font: {
                style: "normal",
                weight: "bold",
                size: vw(0.75),
              },
            },
          },
          y: {
            beginAtZero: true,
            min: 0,
            ticks: {
              stepSize: this.stepSize ? this.stepSize : null,
              font: {
                style: "normal",
                weight: "bold",
                size: vw(0.75),
              },
            },
          },
        },
        responsive: true,
        maintainAspectRatio: this.maintainAspectRatio,
        aspectRatio: aspectRatio * this.aspectRatiofactor,
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: false,
              },
              mode: "x",
            },
            pan: {
              enabled: true,
              mode: "x",
            },
          },
          legend: {
            labels: {
              usePointStyle: true,
              font: {
                size: vw(0.75),
              },
            },
            display: this.hasLegend,
            position: "bottom",
            reverse: true,
          },
          title: {
            display: this.hasTitle,
            text: title,
            color: "#000000",
            font: {
              size: this.titleSize,
              family: "'bosch-Regular'",
            },
            padding: 10,
          },
        },
        onHover: (element, chart) => {
          element["native"]["target"]["style"]["cursor"] = chart[0]
            ? "pointer"
            : "default";
        },
      },
    });
    this.disableFeature();
  }

  resetZoomedChart() {
    this.lineChartGraph.resetZoom();
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
    const nextValElement = document.getElementById("disable_feature");
    if (nextValElement != null) {
      const nextVal = nextValElement.getAttribute("value");

      if (nextVal == "drag") {
        nextValElement.setAttribute("value", "pan");
        nextValElement.setAttribute("class", "boschicon-bosch-ic-zoom-in");
        nextValElement.setAttribute("title", "Enable Zoom");
        this.lineChartGraph.options.plugins.zoom.pan.enabled = true;
        this.lineChartGraph.options.plugins.zoom.pan.mode = "x";
        this.lineChartGraph.options.plugins.zoom.zoom.drag.enabled = false;
        this.lineChartGraph.update();
      } else if (nextVal == "pan") {
        nextValElement.setAttribute("value", "drag");
        nextValElement.setAttribute("class", "boschicon-bosch-ic-compare");
        nextValElement.setAttribute("title", "Enable Drag");
        this.lineChartGraph.options.plugins.zoom.pan.enabled = false;
        this.lineChartGraph.options.plugins.zoom.zoom.drag.enabled = true;
        this.lineChartGraph.options.plugins.zoom.zoom.drag.backgroundColor =
          "rgba(255,99,132,0.2)";
        this.lineChartGraph.options.plugins.zoom.zoom.drag.borderColor =
          "rgba(255,99,132,1)";
        this.lineChartGraph.options.plugins.zoom.zoom.drag.borderWidth = 1;
        this.lineChartGraph.update();
      }
    }
  }
}
