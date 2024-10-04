import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  DoCheck,
} from "@angular/core";
import { Chart, registerables } from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin, ...registerables);
import jsPDF from "jspdf";
import { AppServiceHelper } from "src/app/helpers/app.helper.service";
import { CheckSideNavStatusService } from "src/app/services/check-side-nav-status.service";
import * as moment from "moment";
import * as _ from "lodash";
declare const window: any;

@Component({
  selector: "app-stack-line",
  templateUrl: "./stack-line.component.html",
  styleUrls: ["./stack-line.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StackLineComponent implements OnInit, OnChanges, DoCheck {
  id: string;
  @ViewChild("stack", { static: false }) element: ElementRef;
  @Input() data;
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
  chartObj: any;
  dataSet: any;
  labels: any;
  updatedFromTime: any;
  updatedToTime: any;
  aspectRatiofactor = 1;
  sideNavStatus: boolean;
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
  @Input() hasLegend = true;
  @Input() overAll = false;
  @Input() getLabels = [];
  @Input() hasSecondYaxix = false;
  @Input() leftTitle = "";
  @Input() rightTitle = "";
  @Input() dataFrom = "";
  @Output() sendDownloadData = new EventEmitter();
  @Input() chartName = "";

  constructor(
    private appHelper: AppServiceHelper,
    private checkSideNavStatusService: CheckSideNavStatusService
  ) {
    this.id = `id${appHelper.randomString(10)}`;
  }
  ngOnInit() {
    const self = this;
    window.setTimeout(() => {
      self.definitions();
    }, 100);
    //console.log("ngOnInit", this.view)
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
  }
  ngOnChanges() {
    const self = this;
    window.setTimeout(() => {
      self.definitions();
    }, 100);
    //console.log("ngOnChanges")
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
  }

  ngDoCheck(): void {
    if (
      this.sideNavStatus != this.checkSideNavStatusService.getSideNavStatus()
    ) {
      this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
      this.definitions();
      //console.log("ngDoCheck")
    }

    if (
      this.dataFrom === "1" &&
      this.checkSideNavStatusService.getIsOECLsDownload()
    ) {
      const canvas = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
      let parentData = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement["parentElement"];
      if (
        canvas &&
        context &&
        this.chartObj &&
        this.chartObj["data"] &&
        this.chartObj["data"]["labels"] &&
        this.chartObj["data"]["datasets"]
      ) {
        let arr = JSON.parse(JSON.stringify(this.chartObj["data"]["datasets"]));
        let labelArr = [];
        let dataArr = [];
        let obj = {};
        arr = arr.filter(
          (f) => f.label !== "Average Hourly Energy Consumption of LOCATION"
        );
        arr.map((m) => {
          if (obj[m.label] === undefined) {
            obj[m.label] = [m];
          } else {
            obj[m.label].push(m);
          }
        });
        for (let i in obj) {
          let energy = 0;
          obj[i].map((g) => {
            energy += g.data.find((f) => f != 0);
          });
          dataArr.push(Number(energy.toFixed(3)));
          labelArr.push(i);
        }

        this.sendDownloadData.emit([
          canvas,
          context,
          parentData,
          this.chartObj["data"],
          labelArr,
          dataArr,
          this.chartName,
        ]);
      }
      this.checkSideNavStatusService.setIsOECLsDownload(false);
    }

    if (
      this.dataFrom === "0" &&
      this.checkSideNavStatusService.getIsOECBDownload()
    ) {
      const canvas = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
      let parentData = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement["parentElement"];
      if (
        canvas &&
        context &&
        this.chartObj &&
        this.chartObj["data"] &&
        this.chartObj["data"]["labels"] &&
        this.chartObj["data"]["datasets"]
      ) {
        let formatedLabel = [];
        let formatedData = [];
        this.chartObj["data"].datasets.map((d) => {
          formatedLabel.push(d.label);
          d.data.map((s, j) => {
            formatedData.push({
              Location: d.label,
              Time: this.chartObj["data"].labels[j],
              Energy_Consumption: s,
            });
          });
        });
        this.sendDownloadData.emit([
          canvas,
          context,
          parentData,
          this.chartObj["data"],
          formatedLabel,
          formatedData,
          this.chartName,
        ]);
      }
      this.checkSideNavStatusService.setIsOECBDownload(false);
    }

    if (
      this.dataFrom === "2" &&
      this.checkSideNavStatusService.getIsCLCECRdownload()
    ) {
      const canvas = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
      let parentData = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement["parentElement"];
      if (
        canvas &&
        context &&
        this.chartObj &&
        this.chartObj["data"] &&
        this.chartObj["data"]["labels"] &&
        this.chartObj["data"]["datasets"]
      ) {
        let formatData = [];
        this.chartObj["data"]["datasets"].map((m, i) => {
          formatData.push(m.data[i]);
        });
        this.sendDownloadData.emit([
          canvas,
          context,
          parentData,
          this.chartObj["data"],
          this.chartObj["data"]["labels"],
          formatData,
          this.chartName,
        ]);
      }
      this.checkSideNavStatusService.setIsCLCECRdownload(false);
    }

    if (
      this.dataFrom === "3" &&
      this.checkSideNavStatusService.getIsCLECRBdownload()
    ) {
      const canvas = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
      let parentData = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement["parentElement"];
      if (
        canvas &&
        context &&
        this.chartObj &&
        this.chartObj["data"] &&
        this.chartObj["data"]["labels"] &&
        this.chartObj["data"]["datasets"]
      ) {
        let formatedLabel = [];
        let formatedData = [];
        this.chartObj["data"].datasets.map((d) => {
          formatedLabel.push(d.label);
          d.data.map((s, j) => {
            if (d.data[j] === null || d.data[j] === undefined) {
              d.data[j] = 0;
            }
            formatedData.push({
              Location: d.label,
              Time: this.chartObj["data"].labels[j],
              Energy_Consumption: d.data[j],
            });
          });
        });

        this.sendDownloadData.emit([
          canvas,
          context,
          parentData,
          this.chartObj["data"],
          formatedLabel,
          formatedData,
          this.chartName,
        ]);
      }
      this.checkSideNavStatusService.setIsCLECRBdownload(false);
    }
  }

  definitions(event?) {
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
        this.aspectRatiofactor = 1.15;
      } else {
        this.aspectRatiofactor = 1;
      }
    }

    if (window.innerWidth <= 768 && this.factorCondition) {
      this.aspectRatiofactor = 1;
      this.aspectRatio = 1;
    }

    const height2 = this.element.nativeElement.clientHeight; // this is to auto adjust the height of Y-axis -350
    const width2 = this.element.nativeElement.clientWidth; // this is to auto adjust the height of X-axis - 752
    this.margin = { top: 20, right: 20, bottom: 20, left: 20, legend: 50 };
    this.width = width2;
    this.height = height2;
    if (this.data && this.data.length) {
      //console.log("347", this.keys);
      this.dataSet = this.keys.map((legend, i) => {
        //console.log("legend", legend)
        let label =
          this.customToolTip === true
            ? this.legends[i].split("-")[0]
            : this.legends[i];
        let dataArr = [];
        dataArr = this.data.map((d) => {
          //console.log("d", d)
          let energy = 0.0;
          if (typeof d[legend] !== "undefined" && d[legend] > 0) {
            energy = d[legend].toFixed(2);
            return energy;
          }
        });
        let dataSetObj = {
          label: label,
          data: dataArr,
          backgroundColor: this.colors[i],
          barThickness: 22,
        };
        return dataSetObj;
      });
      //console.log("this.dataSet", this.dataSet)
    }
    //console.log()
    this.formatDate();
    this.stacked();
  }
  padTo2Digits(date) {
    return String(date).padStart(2, "0");
  }
  formatDate() {
    if (this.view === "minute" || this.view === "hour") {
      if (this.showDateRangeInTitle) {
        this.labels = this.data.map(
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
        this.labels = this.data.map(
          (item) =>
            `${this.padTo2Digits(
              new Date(item[this.xAxis]).getHours()
            )}:${this.padTo2Digits(new Date(item[this.xAxis]).getMinutes())}`
        );
      }
    } else if (this.view === "daily" || this.view === "weekly") {
      this.labels = this.data.map(
        (item) =>
          `${this.padTo2Digits(
            new Date(item[this.xAxis]).getDate()
          )} ${this.padTo2Digits(
            new Date(item[this.xAxis]).toLocaleString("default", {
              month: "short",
            })
          )}`
      );
    } else if (this.view === "monthly") {
      this.labels = this.data.map(
        (item) =>
          `${this.padTo2Digits(
            new Date(item[this.xAxis]).toLocaleString("default", {
              month: "long",
            })
          )}`
      );
    }
    this.titltName = this.titltName;
  }
  /*shows the stacked bar graph.*/
  stacked() {
    const self = this;
    //console.log("424", self.nameLabels);
    if (self.nameLabels.length > 0) {
      let categories = Array.from(
        new Set(self.seriesChartData.map((a) => a.category))
      );
      // Create an array of unique appliance names
      const uniqueAppliances = self.seriesChartData.map((a) => {
        return { name: a.name, id: a.id, category: a.category };
      });
      // Create an array of datasets
      self.dataSet = uniqueAppliances.map((appliance, index) => {
        const data = categories.map((category) => {
          const categoryAppliance = self.seriesChartData.find(
            (a) =>
              a.name === appliance.name &&
              a.category === category &&
              a.category === appliance.category &&
              a.id === appliance.id
          );
          return categoryAppliance ? categoryAppliance.energyUsage : 0;
        });
        return {
          label: appliance.name,
          data: data,
          barWidth: 5,
          backgroundColor: self.colors[index],
          barThickness: 22,
        };
      });
      if (self.dataSet.length === 0) {
        self.dataSet = categories.map((k, index) => {
          return {
            label: k,
            data: [],
            barWidth: 5,
            backgroundColor: self.colors[index],
            barThickness: 22,
          };
        });
      }
      self.labels = categories;
    }
    if (this.simpleBar == true) {
      let dataList = [];
      let colorList = [];
      self.data.map((j, index) => {
        dataList.push(j["ENERGY"]);
        colorList.push(self.colors[index]);
      });
      self.dataSet = [
        {
          data: dataList,
          backgroundColor: colorList,
          barWidth: 5,
        },
      ];
      this.labels = this.legends;
    }

    if (this.simpleBar == false) {
      self.dataSet?.sort((a, b) => {
        let totalA = 0;
        let totalB = 0;
        for (var i in a.data) {
          if (a.data[i] !== undefined) {
            totalA += parseFloat(a.data[i]);
          }
        }
        for (var i in b.data) {
          if (b.data[i] !== undefined) {
            totalB += parseFloat(b.data[i]);
          }
        }
        return totalB - totalA;
      });
    }

    const footer = (tooltipItems) => {
      let totoalKwh = "";
      let storeName = "Store Name - ";

      tooltipItems.forEach(function (tooltipItem) {
        self.categoryWiseTotal.find((j) => {
          if (tooltipItem?.label === j.APPLIANCE_CATEGORY) {
            totoalKwh = `Total Energy Consumption: ${j.ENERGY.toFixed(3)}`;
          }
        });

        if (self.overAll) {
          storeName = tooltipItem?.dataset?.name;
        }
      });

      if (self.selectedCategory.length > 0) {
        return `Category: ${self.selectedCategory}`;
      } else if (self.nameLabels.length > 0) {
        return totoalKwh;
      } else {
        if (self.overAll) {
          return storeName;
        } else {
          return "";
        }
      }
    };
    function limitXAxisLabels(chart) {
      const xAxis = chart.scales.x;
      const labels = xAxis.getLabels();
      const newLabels = labels.map((label) => label.substring(0, 10) + "...");
      xAxis.options.ticks.callback = function (value, index, values) {
        if (labels.length <= 2) {
          return labels[index];
        } else {
          return newLabels[index];
        }
      };
      chart.update();
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

    function getHeight() {
      if (window.innerWidth < 1640) {
        return 25;
      } else if (window.innerWidth > 1640) {
        return 30;
      }
    }

    //var ctx = document.querySelector<HTMLElement>("#" + chartId) as HTMLCanvasElement;
    if (self.chartObj) {
      self.chartObj.destroy();
    }

    if (self.mixedChart === true && self.dataSet) {
      self.dataSet.unshift({
        type: "line",
        label: self.mixedChartLabel,
        data: self.mixedChartAvgArr,
        backgroundColor: ["red"],
        borderColor: ["red"],
        borderWidth: 1,
      });
    }

    if (this.overAll) {
      this.labels = [];
      this.labels = this.getLabels;
      let avgData = self.dataSet
        ? JSON.parse(JSON.stringify(self.dataSet[0]))
        : {
          type: "line",
          label: self.mixedChartLabel,
          data: 0,
          backgroundColor: ["red"],
          borderColor: ["red"],
          borderWidth: 1,
        };
      let dataArr = [];
      self.data.map((h, index) => {
        let energyArr = [];
        this.getLabels.map((g, i) => {
          if (h.LOCATION === g) {
            energyArr[i] = h.ENERGY;
          } else {
            energyArr[i] = 0;
          }
        });

        dataArr.push({
          label: h.LOCATION,
          data: energyArr,
          backgroundColor: self.colors[index],
          barThickness: 22,
          name: h.STORE_NAME,
        });
      });
      self.dataSet = _.sortBy(dataArr, "label");
      self.dataSet.unshift(avgData);
    }

    let scaleObject;
    if (self.hasSecondYaxix) {
      scaleObject = {
        x: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            display: self.hideXLabels === true ? false : true,
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          position: "left",
          ticks: {
            stepSize: this.stepSize ? this.stepSize : null,
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
          title: {
            display: true,
            text: self.leftTitle,
            font: {
              size: vw(0.75),
              family: "'bosch-Regular'",
            },
            color: "black",
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: self.rightTitle,
            color: "black",
            font: {
              size: vw(0.7),
              family: "'bosch-Regular'",
            },
          },
          ticks: {
            display: false,
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
            count: (ctx) => {
              return ctx?.chart?.scales?.y?.ticks.length;
            },
          },
          max: (ctx) => {
            return ctx?.chart?.scales?.y1?.max;;
          },
          min: (ctx) => {
            return ctx?.chart?.scales?.y?.min;
          },
        },
      };
    } else {
      scaleObject = {
        x: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            display: self.hideXLabels === true ? false : true,
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            stepSize: this.stepSize ? this.stepSize : null,
            font: {
              style: "normal",
              weight: "bold",
              size: vw(0.75),
            },
          },
        },
      };
    }

    self.chartObj = new Chart(self.id, {
      type: "bar",
      data: {
        labels: this.labels,
        datasets: self.dataSet,
      },

      options: {
        indexAxis: self.seriesChartData.length > 0 ? "y" : "x",
        //indexAxis: "x",
        responsive: true,
        maintainAspectRatio: this.maintainAspectRatio,
        aspectRatio: self.aspectRatio * this.aspectRatiofactor,
        scales: scaleObject,
        onClick: (e, element, chart) => {
          if (self.isClickable === true) {
            if (element && element[0] && element[0]["element"]) {
              if (
                self.storeBarData !=
                element[0]["element"]["$context"]["parsed"]["x"] &&
                self.storeIndex != element[0].index
              ) {
                self.storeBarData =
                  element[0]["element"]["$context"]["parsed"]["x"];
                self.storeIndex = element[0].index;
                self.sendClickStatus.emit([
                  "FILTER",
                  chart.data.labels[element[0].index],
                ]);
              } else {
                self.storeIndex = undefined;
                self.storeBarData = 0;
                self.sendClickStatus.emit([
                  "UNFILTER",
                  chart.data.labels[element[0].index],
                ]);
              }
            }
          }
        },
        plugins: {
          title: {
            display: this.hasTitle,
            text: self.titltName,
            color: "#000000",
            font: {
              size: self.titleSize,
              family: "'bosch-Regular'",
            },
            padding: 10,
            position: self.simpleBar === true ? "bottom" : "top",
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              mode: self.seriesChartData.length > 0 ? "y" : "x",
              //mode:"x",
              drag: {
                enabled: true,
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                borderWidth: 1,
              },
            },
            pan: {
              enabled: true,
              mode: self.seriesChartData.length > 0 ? "y" : "x",
              //mode: "x",
            },
          },
          legend: {
            maxHeight: self.isLegendViible === true ? getHeight() : 2,
            labels: {
              usePointStyle: true,
              font: {
                size: vw(0.75),
              },
            },
            display: self.hasLegend,
            position: "bottom",
          },
          tooltip: {
            callbacks: {
              footer: footer,
            },
            bodyFont: {
              size: vw(0.75),
            },
            footerFont: {
              size: vw(0.75),
            },
          },
        },
        onHover: (element, chart) => {
          element["native"]["target"]["style"]["cursor"] = chart[0]
            ? "pointer"
            : "default";
        },
      },
    });

    if (self.zoomLevel > 0 || self.labels?.length > 200) {
      let listNumberOfItems = self.zoomLevel > 0 ? self.zoomLevel : 20;
      self.chartObj.zoomScale(
        "x",
        {
          min: self.labels.length - listNumberOfItems,
          max: self.labels.length,
        },
        "default"
      );
    }

    // if(this.simpleBar==true){
    //   limitXAxisLabels(self.chartObj);
    // }
    this.disableFeature();
  }

  resetZoomedChart() {
    this.chartObj.resetZoom();
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
        this.chartObj.options.plugins.zoom.pan.enabled = true;
        this.chartObj.options.plugins.zoom.pan.mode = "x";
        this.chartObj.options.plugins.zoom.zoom.drag.enabled = false;
        this.chartObj.update();
      } else {
        nextValElement.setAttribute("value", "drag");
        nextValElement.setAttribute("class", "boschicon-bosch-ic-compare");
        nextValElement.setAttribute("title", "Enable Drag");
        this.chartObj.options.plugins.zoom.pan.enabled = false;
        this.chartObj.options.plugins.zoom.zoom.drag.enabled = true;
        this.chartObj.options.plugins.zoom.zoom.drag.backgroundColor =
          "rgba(255,99,132,0.2)";
        this.chartObj.options.plugins.zoom.zoom.drag.borderColor =
          "rgba(255,99,132,1)";
        this.chartObj.options.plugins.zoom.zoom.drag.borderWidth = 1;
        this.chartObj.update();
      }
    }
  }
}
