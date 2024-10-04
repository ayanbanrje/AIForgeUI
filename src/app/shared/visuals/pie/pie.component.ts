/**
 * @author [ESN3KOR] Ashish Kumar Senapati
 * @email ashishkumar.senapati2@in.bosch.com
 * @create date 2019-11-08 11:11:25
 * @modify date 2019-11-15 11:11:25
 * @desc [description]
 */
import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  ElementRef,
  Output,
  Input,
  OnChanges,
  ViewEncapsulation,
  DoCheck,
} from "@angular/core";
import { Colors } from "src/app/colors.constants";
import * as _ from "lodash";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import jsPDF from "jspdf";
import { AppServiceHelper } from "src/app/helpers/app.helper.service";
import { TranslateService } from "@ngx-translate/core";
import { CheckSideNavStatusService } from "src/app/services/check-side-nav-status.service";

@Component({
  selector: "app-pie",
  templateUrl: "./pie.component.html",
  styleUrls: ["./pie.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PieComponent implements OnInit, OnChanges, DoCheck {
  @ViewChild("chart", { static: false }) element: ElementRef;
  @Output() selected = new EventEmitter();
  @Input() data;
  @Input() totalENERGY;
  @Input() rtmData1;
  @Input() rtmData2;
  @Input() rtmData3;
  @Input() rtmData4;
  @Input() legendflag;
  @Input() pie1label;
  @Input() pie2label;
  @Input() pie3label;
  @Input() colors = Colors.colors;
  @Input() colors1 = Colors.colors;
  @Input() colors2 = Colors.colors;
  @Input() colors3 = Colors.colors;
  @Input() labels = false;
  @Input() disabled = false;
  @Input() values = false;
  @Input() mains = false;
  @Input() rotate = true;
  @Input() minLabelWidth = 0;
  selection: any;
  processedData = [];
  @Input() labelColor = "#005D9A";
  @Input() titltName;
  @Input() titltName1;
  @Input() titltName2;
  @Input() titltName3;
  @Input() screenType: "RTM" | "RAA";
  @Input() chartType: "RTM1" | "RTM2" | "RTM3";
  @Input() aspectRatio;
  @Input() isLegendVisible = true;
  @Input() paddingTop: number = 0;
  @Input() factorCondition: boolean = false;
  labelarray;
  @Output() labelhtmlarray: EventEmitter<any> = new EventEmitter<any>();
  @Input() totalCountRequired: boolean = true;
  @Input() fromFacilityPopUp = false;
  pieChartGraph;
  totalCount;
  selectedDatasetInex = undefined;
  selectedIndex = undefined;
  id;
  storeCanvasObj;
  resetCount;
  filteredlabel;
  maxHeight;
  aspectRatiofactor = 1;
  sideNavStatus: boolean;
  @Input() originalData = [];
  @Input() samllValueArr = [];
  @Output() openPieInBigView = new EventEmitter();
  @Output() moreSelected = new EventEmitter();
  @Input() showCenterData = false;
  @Input() legendPosition = false;
  @Input() centerTextVisible = false;
  @Input() isClickAvailable = true;
  @Input() paddingBottom: number = 0;
  @Input() paddingRight: number = 0;
  @Input() paddingLeft: number = 0;
  @Input() tooltipWithPercentage = false;
  @Input() specificClick = false;
  @Input() resendChartData = false;
  isMobileView = false;
  @Input() isPopOverClicked = false;
  @Input() towordsInside = false;
  @Input() zeroHoverOffset = false;
  @Input() hasOutLabels = true;
  @Input() hasSegmentData = false;
  @Output() sendDownloadData = new EventEmitter();
  @Input() chartName = "";

  constructor(
    private appHelper: AppServiceHelper,
    private translate: TranslateService,
    private checkSideNavStatusService: CheckSideNavStatusService
  ) {
    this.id = `id${appHelper.randomString(10)}`;
  }

  ngOnChanges() {
    window.setTimeout(() => {
      this.load();
    }, 100);
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
    if (this.rtmData4 !== null) {
      this.resendChartData = false;
    }
  }

  ngOnInit() {
    window.setTimeout(() => {
      this.load();
    }, 100);
    this.titltName1 = "Area Wise Energy Consumption";
    this.titltName2 = "Category Wise Energy Consumption";
    this.titltName3 = "Appliances Status";
  }
  ngDoCheck(): void {
    if (
      this.sideNavStatus != this.checkSideNavStatusService.getSideNavStatus()
    ) {
      this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
      //console.log("sideNavStatus", this.sideNavStatus)
      this.load();
    }

    if (
      this.resendChartData === true &&
      JSON.parse(localStorage.getItem("rtmData4")) !== null
    ) {
      this.rtmData4 = JSON.parse(localStorage.getItem("rtmData4"));
      localStorage.removeItem("rtmData4");
    }

    if(this.checkSideNavStatusService.getIsESCDownload()) {
      const canvas = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
      let parentData = document.querySelector<HTMLElement>(
        `#${this.id}`
      ) as HTMLCanvasElement["parentElement"];
      let labelArr = [];
      let dataArr = [];
      this.originalData.map((m)=>{
        labelArr.push(m.LABEL);
        dataArr.push(((Number(m.VALUE)/this.totalENERGY)*100).toFixed(2));
      })
      this.sendDownloadData.emit([canvas,context, parentData, this.pieChartGraph["data"], labelArr, dataArr, this.chartName]);
      this.checkSideNavStatusService.setIsESCDownload(false);
    }
  }

  load() {
    // console.log("this.element",this.element)
    // const height2 = this.element.nativeElement.clientHeight; // this is to auto adjust the height of Y-axis -350
    // const width2 = this.element.nativeElement.clientWidth;  // this is to auto adjust the height of X-axis - 752
    // var width2 = window.innerWidth;
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

    if (window.innerWidth <= 768) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }

    if (this.screenType === "RAA") {
      if (this.data) {
        const temp = [];
        let total = 0;
        const kLength = Object.keys(this.data).length;
        for (const d in this.data) {
          if (this.data[d]) {
            total += Number(this.data[d]);
          }
        }

        for (const d in this.data) {
          if (this.data[d]) {
            temp.push({
              name: d,
              count: this.data[d],
              label: this.data[d],
              percentage: ((this.data[d] / total) * 100).toFixed(2),
            });
          }
        }
        this.processedData = temp;
        this.totalCount = this.totalCountRequired
          ? this.processedData
              .reduce((sum, item) => {
                return (sum = sum + item.label);
              }, 0)
              .toFixed(2)
          : "";
        let labelNameList = [];
        let centerText = `${this.totalCount} kWh`;
        let label = this.totalCountRequired
          ? this.processedData.map((item) => `${item.name}`)
          : this.processedData.map((item) => `${item.name}`);
        this.createPieGraph(
          this.id,
          label,
          this.processedData.map((item) => item.percentage),
          total,
          this.titltName,
          this.colors,
          5,
          10,
          false,
          true,
          25,
          "#008ecf",
          5,
          labelNameList,
          "%"
        );
      }
    } else if (this.screenType === "RTM") {
      if (this.rtmData1) {
        let totalenergy = 0;
        for (let i in this.rtmData1) {
          if (this.rtmData1[i] > 0) {
            totalenergy = totalenergy + this.rtmData1[i];
          }
        }
        let data = [];
        let label = [];
        let labelNameList = [];
        this.maxHeight = 35;
        for (let i in this.rtmData1) {
          if (this.rtmData1[i] > 0) {
            data.push(((this.rtmData1[i] / totalenergy) * 100).toFixed(2));
            //data.push(this.rtmData1[i].toFixed(2));
            label.push(i);
            labelNameList.push(i);
          }
        }
        this.createPieGraph(
          this.id,
          labelNameList,
          data,
          totalenergy.toFixed(3),
          this.titltName1,
          this.colors1,
          this.aspectRatio,
          5,
          true,
          this.isLegendVisible,
          16,
          "#b90276",
          5,
          labelNameList,
          "%"
        );
      }
      if (this.rtmData2) {
        let data = [];
        let label = [];
        let totalCount = 0;
        let labelNameList = [];
        this.maxHeight = 45;
        for (let i in this.rtmData2) {
          totalCount = totalCount + this.rtmData2[i];
          data.push(this.rtmData2[i].toFixed(2));
          label.push(`${i} (${this.rtmData2[i].toFixed(2)})`);
          labelNameList.push(i);
        }
        this.resetCount = totalCount.toFixed(2);
        this.createPieGraph(
          this.id,
          label,
          data,
          totalCount,
          this.titltName2,
          this.colors2,
          1,
          5,
          true,
          false,
          16,
          "#50237f",
          5,
          labelNameList,
          "kWh"
        );
      }
      if (this.rtmData3) {
        let data = [];
        let label = [];
        let totalCount = 0;
        let labelNameList = [];
        this.maxHeight = 35;
        for (let i in this.rtmData3) {
          totalCount = totalCount + this.rtmData3[i];
          data.push(this.rtmData3[i]);
          label.push(`${i} (${this.rtmData3[i]})`);
          labelNameList.push(i);
        }
        this.createPieGraph(
          this.id,
          label,
          data,
          `${this.pie3label} ${this.translate.instant("Appliances")}`,
          this.titltName3,
          this.colors3,
          1,
          0,
          true,
          false,
          16,
          "#005d9a",
          2,
          labelNameList,
          "kWh"
        );
      }
      if (this.rtmData4) {
        let data = [];
        let label = [];
        let totalCount = this.totalENERGY;
        let labelNameList = [];
        this.maxHeight = 30;
        for (let i in this.rtmData4) {
          if (this.rtmData4[i].VALUE > 0) {
            //totalCount = totalCount + this.rtmData4[i].VALUE;
            data.push(
              ((this.rtmData4[i].VALUE / this.totalENERGY) * 100).toFixed(2)
            );
            //label.push(`${this.rtmData4[i].LABEL}`);
            label.push(`${this.rtmData4[i].LABEL}`);
            labelNameList.push(`${this.rtmData4[i].LABEL}`);
          }
        }
        //label.slice(0,3);
        this.createPieGraph(
          this.id,
          label,
          data,
          totalCount,
          this.titltName1,
          this.colors1,
          this.aspectRatio,
          5,
          true,
          this.isLegendVisible,
          16,
          "#b90276",
          5,
          labelNameList,
          "%"
        );
      }
    }
  }

  createPieGraph(
    chartName,
    labels,
    processedData,
    centerText,
    titltName,
    colors,
    aspectRatio,
    hoverOffset,
    isExplodable,
    isLegendVisible,
    fontSize,
    textColor,
    explodeAmount,
    labelNameList?,
    valueType?
  ) {
    if (this.zeroHoverOffset) {
      hoverOffset = 0;
      isExplodable = false;
    }
    centerText = centerText?.toString();
    if (this.pieChartGraph) {
      this.pieChartGraph.destroy();
    }
    if (centerText == "0.00 kWh") {
      // centerText = this.translate.instant('No_Data');
      centerText = "No Data";
    }
    let count = 0;
    const self = this;
    const beforeChartDraw = {
      id: "beforeChartDraw",
      beforeDraw(chart) {
        const {
          ctx,
          chartArea: { top, right, bottom, left, width, height },
        } = chart;
        if (self.centerTextVisible == true) {
          ctx.save();
          ctx.font = "1.6vw bosch-Medium";
          ctx.textAlign = "center";
          ctx.fillStyle = "black";
          if (window.innerWidth <= 768) {
            ctx.fillText(`${centerText} Kwh`, width / 2 + 20, top + height / 2);
          } else {
            if (self.checkSideNavStatusService.getSideNavStatus() == true) {
              ctx.fillText(
                `${centerText} Kwh`,
                width / 2 + 20,
                top + height / 2
              );
            } else {
              ctx.fillText(
                `${centerText} Kwh`,
                width / 2 + 10,
                top + height / 2
              );
            }
          }
          ctx.restore();
        }
      },
    };
    let tempData = {
      labels: labels,
      datasets: [
        {
          data: processedData,
          backgroundColor: colors,
          hoverOffset: hoverOffset,
          borderRadius: 0,
        },
      ],
    };

    let sortedLabels = [];
    let sortedData = [];
    let sortedColors = [];

    for (let i = 0; i < processedData.length; i++) {
      let maxIndex = processedData.reduce(
        (maxIndex, value, index, arr) =>
          parseFloat(value) > parseFloat(arr[maxIndex]) ? index : maxIndex,
        i
      );
      sortedData.push(processedData[maxIndex]);
      sortedLabels.push(labels[maxIndex]);
      sortedColors.push(colors[maxIndex]);
      processedData[maxIndex] = Number.NEGATIVE_INFINITY;
    }

    tempData = {
      labels: sortedLabels,
      datasets: [
        {
          data: sortedData,
          backgroundColor: sortedColors,
          hoverOffset: hoverOffset,
          borderRadius: 0,
        },
      ],
    };
    labelNameList = sortedLabels;
    const label = (context) => {
      let label = ((context.formattedValue * centerText) / 100).toFixed(2);
      let lbl = "";
      if (self.tooltipWithPercentage === true) {
        lbl =
          context.label +
          ": " +
          ((context.formattedValue * centerText) / 100).toFixed(2) +
          " kWh" +
          " (" +
          ((parseInt(label) / parseInt(centerText)) * 100).toFixed(2) +
          "%" +
          ")";
      } else {
        lbl =
          context.label +
          ": " +
          ((context.formattedValue * centerText) / 100).toFixed(2) +
          " kWh";
      }
      //logic to avoid nan in tooltip
      if (context.formattedValue > 0) return lbl;
      else return "0.00 kWh";
    };

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

    //Function for doughnut outer-label
    const doughnutOutLabel = {
      id: "doughnutOutLabel",
      afterDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { top, right, bottom, left, width, height },
        } = chart;

        if (self.hasOutLabels) {
          chart?.data?.datasets.forEach((dataset, i) => {
            chart?.getDatasetMeta(i).data.forEach((dataPoint, index) => {
              if (chart?.data?.labels[index] === "Rest of the stores") {
                const { x, y } = dataPoint.tooltipPosition();
                // draw line
                const halfWidth = width / 2;
                const halfHeight = height / 2;
                const xLine = x >= halfWidth ? x + 25 : x - 25;
                const yLine = y >= halfHeight ? y + 35 : y - 35;
                const extraLine = x >= halfWidth ? 10 : -10;
                // line
                ctx.beginPath();
                ctx.moveTo(x, y + 5);
                if (self.isMobileView === true) {
                  ctx.lineTo(xLine + 10, yLine + 10);
                  ctx.lineTo(xLine + extraLine + 10, yLine + 10);
                } else {
                  ctx.lineTo(xLine, yLine);
                  ctx.lineTo(xLine + extraLine, yLine);
                }
                ctx.strokeStyle = "#BFC0C2";
                ctx.stroke();
                // text
                if (self.isMobileView === true) {
                  ctx.font = "2.5vw bosch-Medium";
                } else {
                  ctx.font = "0.9vw bosch-Medium";
                }
                // control position
                const textPosition = x >= halfWidth ? "left" : "right";
                const plusPx = x >= halfWidth ? 5 : -5;
                ctx.textAlign = textPosition;
                ctx.textBaseLine = "middle";
                ctx.fillStyle = "#0088D4";
                ctx.fillText(
                  "ⓘ",
                  self.isMobileView === true
                    ? xLine + extraLine + plusPx + 10
                    : xLine + extraLine + plusPx,
                  self.isMobileView === true ? yLine + 10 : yLine
                );
                // chart?.data?.labels[index]
              }
            });
          });
        }
      },
    };

    const segmentData = {
      id: "segmentData",
      afterDatasetDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { top, right, bottom, left, width, height },
        } = chart;

        if (self.hasSegmentData) {
          chart?.data?.datasets.forEach((dataset, i) => {
            chart?.getDatasetMeta(i).data.forEach((dataPoint, index) => {
              if (chart?.data?.labels[index] === "Rest of the stores") {
                // const image = new Image();
                // image.src = "../../../assets/images/lightbulb_icon.png";
                // const length = 10;
                // ctx.save();
                // const x = chart
                //     .getDatasetMeta(0)
                //     .data[index].tooltipPosition().x;
                //   const y = chart
                //     .getDatasetMeta(0)
                //     .data[index].tooltipPosition().y;
                //   ctx.drawImage(
                //     image,
                //     x - length / 2,
                //     y - length / 2,
                //     length,
                //     length
                //   );
              }
            });
          });
        }
      },
    };
    this.pieChartGraph = new Chart(chartName, {
      type: "doughnut",
      data: tempData,
      options: {
        elements: {
          arc: {
            borderWidth: 0,
          },
        },
        aspectRatio: aspectRatio * this.aspectRatiofactor,
        maintainAspectRatio: true,
        responsive: true,
        onClick: (e, element, chart) => {
          if (self.isClickAvailable === true) {
            if (
              self.specificClick === true &&
              chart?.data?.labels[element[0]?.index] === "Rest of the stores"
            ) {
              let clickData = {};
              if (labelNameList) {
                if (isExplodable === true) {
                  let segment;
                  if (this.storeCanvasObj) {
                    if (element && element.length) {
                      segment = element[0];
                      if (
                        this.storeCanvasObj["index"] === segment["index"] &&
                        count === 1
                      ) {
                        this.storeCanvasObj.element.outerRadius -=
                          explodeAmount;
                        count = 0;
                        centerText = `${self.resetCount} kWh`;
                        if (element.length > 0) {
                          clickData = {
                            clicked: false,
                            color: element[0].element.options.backgroundColor,
                            name: labelNameList[element[0].index],
                          };
                        } else {
                          clickData = {
                            clicked: false,
                            color: colors[0],
                            name: labelNameList[0],
                          };
                        }
                        if (
                          chart?.data?.labels[element[0]?.index] !==
                          "Rest of the stores"
                        ) {
                          if (this.fromFacilityPopUp === true) {
                            localStorage.setItem(
                              "clickData",
                              JSON.stringify(clickData)
                            );
                          }
                          this.selected.emit(clickData);
                        } else {
                          this.moreSelected.emit(this.fromFacilityPopUp);
                        }
                        return;
                      } else if (
                        this.storeCanvasObj["index"] !== segment["index"] &&
                        count === 1
                      ) {
                        this.storeCanvasObj.element.outerRadius -=
                          explodeAmount;
                        count = 0;
                      }
                      this.storeCanvasObj = element[0];
                      segment.element.outerRadius += explodeAmount;
                      count++;

                      if (element.length > 0) {
                        clickData = {
                          clicked: true,
                          color: element[0].element.options.backgroundColor,
                          name: labelNameList[element[0].index],
                        };
                      } else {
                        clickData = {
                          clicked: true,
                          color: colors[0],
                          name: labelNameList[0],
                        };
                      }
                      if (
                        chart?.data?.labels[element[0]?.index] !==
                        "Rest of the stores"
                      ) {
                        if (this.fromFacilityPopUp === true) {
                          localStorage.setItem(
                            "clickData",
                            JSON.stringify(clickData)
                          );
                        }
                        this.selected.emit(clickData);
                      }
                    }
                  } else {
                    if (element && element.length) {
                      this.storeCanvasObj = [];
                      segment = element[0];
                      this.storeCanvasObj = segment;
                      count++;
                      segment.element.outerRadius += explodeAmount;

                      if (element.length > 0) {
                        clickData = {
                          clicked: true,
                          color: element[0].element.options.backgroundColor,
                          name: labelNameList[element[0].index],
                        };
                      } else {
                        clickData = {
                          clicked: true,
                          color: colors[0],
                          name: labelNameList[0],
                        };
                      }
                      if (
                        chart?.data?.labels[element[0]?.index] !==
                        "Rest of the stores"
                      ) {
                        if (this.fromFacilityPopUp === true) {
                          localStorage.setItem(
                            "clickData",
                            JSON.stringify(clickData)
                          );
                        }
                        this.selected.emit(clickData);
                      }
                    }
                  }
                }
              }

              if (this.screenType === "RTM" && this.chartType === "RTM2") {
                if (element[0]) {
                  self.selectedDatasetInex = element[0].datasetIndex;
                  self.selectedIndex = element[0].index;
                  centerText = `${processedData[element[0].index]} kWh`;
                  chart.draw();
                }
              }

              if (this.screenType === "RTM" && this.chartType === "RTM1") {
                if (
                  chart?.data?.labels[element[0]?.index] ===
                  "Rest of the stores"
                ) {
                  this.openPieInBigView.emit(true);
                }
              }
            } else if (self.specificClick === false) {
              let clickData = {};
              if (labelNameList) {
                if (isExplodable === true) {
                  let segment;
                  if (this.storeCanvasObj) {
                    if (element && element.length) {
                      segment = element[0];
                      if (
                        this.storeCanvasObj["index"] === segment["index"] &&
                        count === 1
                      ) {
                        this.storeCanvasObj.element.outerRadius -=
                          explodeAmount;
                        count = 0;
                        centerText = `${self.resetCount} kWh`;
                        if (element.length > 0) {
                          clickData = {
                            clicked: false,
                            color: element[0].element.options.backgroundColor,
                            name: labelNameList[element[0].index],
                          };
                        } else {
                          clickData = {
                            clicked: false,
                            color: colors[0],
                            name: labelNameList[0],
                          };
                        }
                        if (
                          chart?.data?.labels[element[0]?.index] !==
                          "Rest of the stores"
                        ) {
                          if (this.fromFacilityPopUp === true) {
                            localStorage.setItem(
                              "clickData",
                              JSON.stringify(clickData)
                            );
                          }
                          this.selected.emit(clickData);
                        } else {
                          this.moreSelected.emit(this.fromFacilityPopUp);
                        }
                        return;
                      } else if (
                        this.storeCanvasObj["index"] !== segment["index"] &&
                        count === 1
                      ) {
                        this.storeCanvasObj.element.outerRadius -=
                          explodeAmount;
                        count = 0;
                      }
                      this.storeCanvasObj = element[0];
                      segment.element.outerRadius += explodeAmount;
                      count++;

                      if (element.length > 0) {
                        clickData = {
                          clicked: true,
                          color: element[0].element.options.backgroundColor,
                          name: labelNameList[element[0].index],
                        };
                      } else {
                        clickData = {
                          clicked: true,
                          color: colors[0],
                          name: labelNameList[0],
                        };
                      }
                      if (
                        chart?.data?.labels[element[0]?.index] !==
                        "Rest of the stores"
                      ) {
                        if (this.fromFacilityPopUp === true) {
                          localStorage.setItem(
                            "clickData",
                            JSON.stringify(clickData)
                          );
                        }
                        localStorage.setItem(
                          "defaultClickData",
                          JSON.stringify(clickData)
                        );
                        this.selected.emit(clickData);
                      }
                    }
                  } else {
                    if (element && element.length) {
                      this.storeCanvasObj = [];
                      segment = element[0];
                      this.storeCanvasObj = segment;
                      count++;
                      segment.element.outerRadius += explodeAmount;

                      if (element.length > 0) {
                        clickData = {
                          clicked: true,
                          color: element[0].element.options.backgroundColor,
                          name: labelNameList[element[0].index],
                        };
                      } else {
                        clickData = {
                          clicked: true,
                          color: colors[0],
                          name: labelNameList[0],
                        };
                      }
                      if (
                        chart?.data?.labels[element[0]?.index] !==
                        "Rest of the stores"
                      ) {
                        if (this.fromFacilityPopUp === true) {
                          localStorage.setItem(
                            "clickData",
                            JSON.stringify(clickData)
                          );
                        }
                        if (this.isPopOverClicked === true) {
                          localStorage.setItem(
                            "PopOverData",
                            JSON.stringify(clickData)
                          );
                          localStorage.setItem(
                            "clickLocation",
                            JSON.stringify([
                              element["datasetIndex"],
                              element["index"],
                            ])
                          );
                        }
                        this.selected.emit(clickData);
                      }
                    }
                  }
                }
              }

              if (this.screenType === "RTM" && this.chartType === "RTM2") {
                if (element[0]) {
                  self.selectedDatasetInex = element[0].datasetIndex;
                  self.selectedIndex = element[0].index;
                  centerText = `${processedData[element[0].index]} kWh`;
                  chart.draw();
                }
              }

              if (this.screenType === "RTM" && this.chartType === "RTM1") {
                if (
                  chart?.data?.labels[element[0]?.index] ===
                  "Rest of the stores"
                ) {
                  this.openPieInBigView.emit(true);
                }
              }
            }
          }
        },
        layout: {
          padding: {
            top: self.paddingTop,
            bottom: self.paddingBottom,
            right: self.paddingRight,
            left: self.paddingLeft,
          },
        },
        plugins: {
          datalabels: {
            formatter: (value,ctx) => {
              const label = ctx.chart.data.labels[ctx.dataIndex];
              if (value < 5) {
                if(self.zeroHoverOffset) {
                  if (label === 'Rest of the stores') {
                    return "ⓘ";
                  } else {
                    return "";
                  }
                } else {
                  return "";
                }
              } else {
                if(self.zeroHoverOffset) {
                  if (label === 'Rest of the stores') {
                    return `${Number(value).toFixed(0) + valueType} ⓘ`;
                  } else {
                    return Number(value).toFixed(0) + valueType;
                  }
                } else {
                  return Number(value).toFixed(2) + valueType;
                }
              }
            },
            color: "#fff",
            font: {
              size: vw(0.65), //Math.ceil(10 / this.aspectRatiofactor)
              family: "bosch-Regular",
            },
          },
          tooltip: {
            xAlign: "center",
            yAlign: "top",
            caretPadding: 10,
            callbacks: {
              label: label,
            },
            footerFont: {
              size: vw(0.75),
              family: "bosch-Regular",
            },
            bodyFont: {
              size: vw(0.75),
              family: "bosch-Regular",
            },
          },
          legend: {
            maxHeight: 26,
            display: isLegendVisible,
            position: self.legendPosition ? "right" : "bottom",
            labels: {
              usePointStyle: true,
              font: {
                size: vw(0.75),
                family: "bosch-Bold",
              },
            },
          },
          title: {
            display: false,
            text: titltName,
            color: textColor,
            font: {
              size: fontSize,
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
      plugins: [
        beforeChartDraw,
        ChartDataLabels,
        doughnutOutLabel,
        segmentData,
      ],
    });
    // if (self.towordsInside === true) {
    //   Chart.defaults.datasets.doughnut["cutout"] = "20%";
    // } else {
    //   Chart.defaults.datasets.doughnut["cutout"] = "50%";
    // }
    // this.composelabelarray(this.pieChartGraph);
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

  // composelabelarray(array) {
  //   const desiredlabel = array.data.labels;
  //   const desiredlabellength = desiredlabel.length;
  //   const colors = array.data.datasets[0].backgroundColor;
  //   this.labelarray = [];
  //   for (let i = 0; i < desiredlabellength; i++) {
  //     const element = { label: desiredlabel[i], color: colors[i] }
  //     this.labelarray.push(element)
  //   }
  //   this.labelhtmlarray.emit(this.labelarray)
  // }

  // simulateClick(datasetIndex: number, index: number): void {
  //   const elements = this.pieChartGraph.getElementAtEvent({ x: 0, y: 0 });
  //   if (elements && elements.length > 0) {
  //     const clickedElement = elements.find(element =>
  //       element._datasetIndex === datasetIndex && element._index === index
  //     );
  //     if (clickedElement) {
  //       this.pieChartGraph.options.onClick(null, [clickedElement]);
  //     }
  //   }
  // }
}
