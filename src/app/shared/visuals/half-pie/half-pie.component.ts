import { Component, OnInit, Input, OnChanges, Output, EventEmitter, DoCheck } from "@angular/core";
import { Chart, ArcElement, CategoryScale, Title, Tooltip } from "chart.js";
import { CheckSideNavStatusService } from "src/app/services/check-side-nav-status.service";

@Component({
  selector: "app-half-pie",
  templateUrl: "./half-pie.component.html",
  styleUrls: ["./half-pie.component.scss"],
})
export class HalfPieComponent implements OnInit, OnChanges, DoCheck {
  datasets;
  labels;
  @Input() totalENERGY;
  centerText = "hello ji";
  centerTextVisible: boolean = true;
  chart;
  @Input() totalTarget = 0;
  @Input() maintainAspectRatio = true;
  @Input() hasTitle = false;
  @Input() title = ''
  @Input() hasCustomeCenterText = false;
  @Input() customeCenterText = '';
  @Input() hasCustomeLeftText = false;
  @Input() customeLeftText = '';
  @Input() hasCustomeRightText = false;
  @Input() customeRightText = '';
  @Input() titleColor = 'black';
  @Output() sendDownloadData = new EventEmitter();
  @Input() chartName = "";

  constructor(private checkSideNavStatusService: CheckSideNavStatusService) {

  }

  ngDoCheck() {
    if (this.checkSideNavStatusService.getIsHalfPieDownload()) {
      const canvas = document.querySelector<HTMLElement>(
        `#half-pie-chart`
      ) as HTMLCanvasElement;
      const context = canvas?.getContext("2d");
      let parentData = document.querySelector<HTMLElement>(
        `#half-pie-chart`
      ) as HTMLCanvasElement["parentElement"];
      //console.log("chart data", this.chart["data"])
      this.sendDownloadData.emit([canvas, context, parentData, this.chart["data"], this.chart["data"]["labels"], [this.chart["data"]["datasets"][0]["data"][0], this.totalTarget], this.chartName]);
      this.checkSideNavStatusService.setIsHalfPieDownload(false);

    }
    if (this.totalTarget > 0) {
      //console.log(JSON.parse(JSON.stringify(this.totalTarget)))
    }
  }

  ngOnInit() {
    if (this.totalENERGY > 0) {
      window.setTimeout(() => {
        this.load();
      }, 100);
    }
  }

  ngOnChanges() {
    if (this.totalENERGY > 0) {
      window.setTimeout(() => {
        this.load();
      }, 100);
    }
  }

  load() {
    const self = this;
    self.createDataset();
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
    //console.log("target", `${self.totalTarget}`)
    const afterChartDraw = {
      id: "afterChartDraw",
      afterDraw(chart) {
        const ctx = chart.ctx;
        const chartArea = chart.chartArea;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY =
          chartArea.top + ((chartArea.bottom - chartArea.top) * 2) / 3; // Adjust the fraction as needed
        const centerY1 =
          chartArea.top + ((chartArea.bottom - chartArea.top) * 3) / 4; // Adjust the fraction as needed
        const line1 = "Target vs Actual";
        const line2 = "Energy Consumption";
        let sum = `${self.totalTarget}`; //dataset?.data?.reduce((acc, value) => acc + value, 0);
        const line3 = "0 kWh";
        const padding = 5; // Set the padding value in pixels
        sum = sum === "0" ? "No Target Set" : `${sum} kWh`;
        const line4 = sum; //`${sum.toFixed(2)} kWh Target`
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000"; // Set the color of the text

        // Set the font size in pixels
        let fontSize = vw(0.7);
        ctx.font = `${fontSize}px bosch-Medium`;
        // Calculate the position of the text slightly downwards
        const lineHeight = vw(1.5); // Adjust the line height as needed
        const line1Y = !self.hasCustomeCenterText ? centerY - lineHeight / 2 : centerY - lineHeight / 5;
        const line2Y = centerY + lineHeight / 2;
        const line3Y = centerY1 + lineHeight / 2;
        const line4Y = centerY1 + lineHeight / 2; // Align to the bottom of the chart area

        if (!self.hasCustomeCenterText) {
          // Add the first line of text
          ctx.fillText(line1, centerX, line1Y);

          // Add the second line of text
          ctx.fillText(line2, centerX, line2Y);
        } else {
          let fontSize = vw(1.65);
          ctx.font = `${fontSize}px bosch-Bold`;
          ctx.fillStyle = "#0088D4";
          ctx.fillText(self.customeCenterText, centerX, line1Y);
        }

        // Add the third line of text aligned to the start of the x-axis
        ctx.textAlign = "left";
        if (!self.hasCustomeLeftText) {
          ctx.fillText(line3, chartArea.left + padding, line3Y);
        } else {
          let fontSize = vw(0.8);
          ctx.font = `${fontSize}px bosch-Medium`;
          ctx.fillStyle = "#000";
          ctx.fillText(self.customeLeftText, chartArea.left + padding, line3Y);
        }

        // Add the fourth line of text aligned to the end of the x-axis
        ctx.textAlign = "right";
        if (!self.hasCustomeLeftText) {
          ctx.fillText(line4, chartArea.right, line4Y);
        } else {
          let fontSize = vw(0.8);
          ctx.font = `${fontSize}px bosch-Medium`;
          ctx.fillStyle = "#000";
          ctx.fillText(self.customeRightText, chartArea.right, line4Y);
        }
      },
    };

    const label = (context) => {
      let lbl = "";
      if (context.label == "Actual") {
        lbl = this.totalENERGY;
        return `${Number(lbl).toFixed(2)} kWh`;
      } else {
        //console.log("total target", `${this.totalTarget}`)
        lbl = this.totalTarget.toString();
        return `${Number(lbl).toFixed(2)} kWh`;
      }
    };

    // Register necessary plugins
    Chart.register(ArcElement, CategoryScale, Title, Tooltip);

    // Get the canvas element
    const canvas = document.getElementById(
      "half-pie-chart"
    ) as HTMLCanvasElement;

    // Create the half pie chart
    const ctx = canvas.getContext("2d");

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: "pie",
      data: {
        datasets: this.datasets,
        labels: this.labels,
      },
      options: {
        // layout: {
        //   padding: {
        //     bottom: 15
        //   },
        // },
        responsive: true,
        // aspectRatio: 2.5,
        maintainAspectRatio: this.maintainAspectRatio,
        cutout: "50%",
        circumference: 180,
        rotation: -90,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: this.hasTitle,
            text: this.title,
            color: this.titleColor,
            font: {
              family: "'bosch-Regular'",
              style: "normal",
              weight: "bold",
              size: vw(1.3),
            },
          },
          tooltip: {
            callbacks: {
              label: label,
            },
          },
        },
        onHover: (element, chart) => {
          element["native"]["target"]["style"]["cursor"] = chart[0]
            ? "pointer"
            : "default";
        },
      },
      plugins: [afterChartDraw],
    });
  }

  createDataset() {
    let data1 = 0;
    let data2 = 0;
    data1 = this.totalENERGY;
    data2 = this.totalTarget - data1;

    if (data2 < 0) {
      data2 = 0;
    }
    // if (this.totalTarget=== 0) {
    //   data2 = this.totalTarget;
    // }
    // else {
    //   if (this.totalTarget > data1) {
    //     data2 = this.totalTarget - data1;
    //   } else {
    //     data2 = data1 - this.totalTarget;
    //   }
    // }

    this.datasets = [
      {
        data: [data1, data2],
        backgroundColor: ["#37A264", "#E0E2E5"],
      },
    ];
    this.labels = ["Actual", "Target"];
  }
}
