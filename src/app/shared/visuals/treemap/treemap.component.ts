import { Component, OnInit, Input, OnChanges, DoCheck, Output, EventEmitter } from "@angular/core";
import { Chart, registerables } from "chart.js";
import "chartjs-chart-treemap";
import { TreemapController, TreemapElement, TreemapScriptableContext } from "chartjs-chart-treemap";
import zoomPlugin from "chartjs-plugin-zoom";
import { CheckSideNavStatusService } from "src/app/services/check-side-nav-status.service";
Chart.register(TreemapController, TreemapElement, ...registerables);

@Component({
  selector: "app-treemap",
  templateUrl: "./treemap.component.html",
  styleUrls: ["./treemap.component.scss"],
})
export class TreemapComponent implements OnInit, OnChanges, DoCheck {
  @Input() dataset;
  @Input() applianceWiseList;
  @Input() colors;
  @Input() dataforappliances;
  @Input() selectedCategory;
  treeMapChart;
  data = [];
  @Input() title = false;
  @Input() titleText;
  @Input() hasLabel = false;
  @Input() totalEnergyConumption;
  @Input() allVisible = false;
  @Input() overallSummary = false;
  @Input() showLessTen = false;
  @Output() sendDownloadData = new EventEmitter();
  @Input() chartName = "";

  constructor(private checkSideNavStatusService: CheckSideNavStatusService) {

  }

  ngDoCheck() {
    if (this.checkSideNavStatusService.getIsTreeDownload()) {
      // const canvas = document.querySelector<HTMLElement>(
      //   `#myChart`
      // ) as HTMLCanvasElement;
      // const context = canvas?.getContext("2d");
      // let parentData = document.querySelector<HTMLElement>(
      //   `#myChart`
      // ) as HTMLCanvasElement["parentElement"];
      // this.sendDownloadData.emit([canvas,context, parentData, this.treeMapChart["data"], this.treeMapChart["data"]["labels"], this.treeMapChart["data"]["datasets"][0]["data"], this.chartName]);
      // this.checkSideNavStatusService.setIsTreeDownload(false);
    }
  }

  ngOnInit() {
    window.setTimeout(() => {
      this.createTreeMapChart();
    }, 100);
  }

  ngOnChanges() {
    window.setTimeout(() => {
      this.createTreeMapChart();
    }, 100);
  }

  createTreeMapChart(): void {
    if (this.treeMapChart) {
      this.treeMapChart.destroy();
    }
    const self = this;
    self.totalEnergyConumption = Number(self.totalEnergyConumption);
    self.data = [];
    let totalEnergy = 0;
    self.dataset = self.overallSummary ? self.dataset?.filter((f) => f.APPLIANCE_CATEGORY_NAME !== undefined) : self.dataset?.filter((f) => f.APPLIANCE_NAME !== undefined);
    self.dataset?.map((f) => {
      self.data.push(f.ENERGY).toFixed(2);
      totalEnergy += f.ENERGY;
    });
    let values = self.dataset;
    values = values.sort((a, b) => b.ENERGY - a.ENERGY);
    values.map((f) => {
      f["percentage"] = Number(((f.ENERGY / self.totalEnergyConumption) * 100).toFixed(2));
      return f;
    });
    let chartRef = Chart.getChart("myChart");
    if (chartRef !== undefined) {
      chartRef.destroy();
    }
    const ctx = <HTMLCanvasElement>document.getElementById("myChart");
    // Chart.defaults.font.size = 14;
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

    function splitLabel(label: string, maxWidth: number, ctx: TreemapScriptableContext) {
      const words = label.split(' ');
      const lines = [];
      let currentLine = '';
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const newLine = currentLine + `${i == 0 ? '' : ' '}` + word;
        const width = ctx.chart.ctx.measureText(newLine).width;
        if (width < maxWidth) {
          currentLine = newLine;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }
    const data = self.data;

    this.treeMapChart = new Chart(ctx, {
      type: "treemap",
      data: {
        datasets: [
          {
            label: "Value",
            data: data,
            backgroundColor: (context) => {
              return self.colors[context.dataIndex];
            },
            borderWidth: 1,
            labels: {
              display: this.hasLabel,
              align: "left",
              position: "top",
              padding: 15,
              color: "white",
              overflow: self.showLessTen ? "hidden" : "cut",
              formatter: (ctx) => {
                if (this.hasLabel === true) {
                  if (values[ctx.dataIndex]?.percentage > 10 && this.allVisible === false) {
                    let value = self.overallSummary ? `${values[ctx.dataIndex]?.APPLIANCE_CATEGORY_NAME
                      } - ${values[ctx.dataIndex].ENERGY.toFixed(2)}kWh , ${values[ctx.dataIndex]?.percentage
                      }%` : `${values[ctx.dataIndex]?.APPLIANCE_NAME
                      } - ${values[ctx.dataIndex].ENERGY.toFixed(2)}kWh , ${values[ctx.dataIndex]?.percentage
                    }%`;
                    return splitLabel(value, ctx.raw.w * 0.7, ctx);
                  } else {
                    if (self.showLessTen) {
                      let value = self.overallSummary ? `${values[ctx.dataIndex]?.APPLIANCE_CATEGORY_NAME
                        } - ${values[ctx.dataIndex].ENERGY.toFixed(2)}kWh , ${values[ctx.dataIndex]?.percentage
                        }%` : `${values[ctx.dataIndex]?.APPLIANCE_NAME
                        } - ${values[ctx.dataIndex].ENERGY.toFixed(2)}kWh , ${values[ctx.dataIndex]?.percentage
                      }%`;
                      return splitLabel(value, ctx.raw.w * 0.7, ctx);
                    } else {
                      return;
                    }
                  }
                } else {
                  return;
                }
              },
              font: (ctx: any) => {
                const fontSize = ctx.type === "data" ? vw(0.685) : vw(1);
                return {
                  size: fontSize,
                  weight: "normal", // ctx.type === "data" ? "bold" : "normal"
                  family: "bosch-Regular", // Add the desired font family
                  style: "normal", // Add the desired font style
                  lineHeight: 1.2, // Add the desired line height
                };
              },
            },
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context) {
                if (self.overallSummary) {
                  return `${values[context?.dataIndex].APPLIANCE_CATEGORY_NAME} - ${values[
                    context?.dataIndex
                  ].ENERGY.toFixed(2)}kWh, ${values[context?.dataIndex]?.percentage
                    }%`;
                } else {
                  return `${values[context?.dataIndex].APPLIANCE_NAME}(${values[context?.dataIndex].DEVICE_ID}) - ${values[
                    context?.dataIndex
                  ].ENERGY.toFixed(2)}kWh, ${values[context?.dataIndex]?.percentage
                    }%`;
                }
              },
              footer: function (context) {
                if (self.selectedCategory) {
                  return `Category: ${self.selectedCategory}`;
                }
              },
            },
            bodyFont: {
              family: "bosch-Medium",
              size: vw(0.75),
            },
            footerFont: {
              family: "bosch-Medium",
              size: vw(0.75),
            },
          },
          title: {
            display: this.title,
            text: this.titleText,
            font: {
              family: "bosch-Medium",
              size: vw(1),
            },
            color: "balck",
            position: "bottom",
          },
        },
        onHover: (element, chart) => {
          element["native"]["target"]["style"]["cursor"] = chart[0] ? 'pointer' : 'default';
        }
      },
    });
  }
}
