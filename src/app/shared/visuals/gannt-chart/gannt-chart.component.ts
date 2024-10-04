import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
} from "@angular/core";
import { Console } from "console";
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns";
import zoomPlugin from "chartjs-plugin-zoom";
Chart.register(zoomPlugin, ...registerables);
import jsPDF from "jspdf";
import { AppServiceHelper } from "src/app/helpers/app.helper.service";
import { CheckSideNavStatusService } from "src/app/services/check-side-nav-status.service";
import * as moment from "moment";
import { de } from "date-fns/locale";
declare const window: any;
@Component({
  selector: "app-gannt-chart",
  templateUrl: "./gannt-chart.component.html",
  styleUrls: ["./gannt-chart.component.scss"],
})
export class GanntChartComponent implements OnInit, OnChanges {
  id: string;
  @ViewChild("gantt", { static: false }) element!: ElementRef;
  @Input() data;
  @Input() xAxis;
  @Input() yAxis = {
    display: false,
  };
  @Input() yAxisLabel = ["", ""];
  @Input() keys;
  @Input() legends;
  @Input() colors = [];
  @Input() view;
  @Input() secondary;
  @Input() active = false;
  @Input() fromTime;
  @Input() toTime;
  @Input() period;
  @Input() titltName;
  @Input() showDateRangeInTitle;
  @Input() aspectRatio;
  @Input() isZoomPan;
  @Input() isResetZoom;
  @Input() isDownloadPng;
  @Input() isDownloadJpg;
  @Input() isDownloadPdf;
  @Input() titleSize;
  // @Input() chartHeight;

  datac;
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
    }, 500);
  }
  ngOnChanges() {
    const self = this;
    window.setTimeout(() => {
      self.definitions();
    }, 500);
    this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
  }
  ngDoCheck(): void {
    if (
      this.sideNavStatus != this.checkSideNavStatusService.getSideNavStatus()
    ) {
      this.sideNavStatus = this.checkSideNavStatusService.getSideNavStatus();
      this.definitions();
    }
  }
  definitions(event?) {
    // console.log("period",this.period)
    var height3 = window.innerHeight;
    // if (this.sideNavStatus) {
    //   this.aspectRatiofactor = 1.15;
    // } else {
    //   this.aspectRatiofactor = 1;
    // }
    //console.log("this.element",event)
    const height2 = this.element.nativeElement.clientHeight; // this is to auto adjust the height of Y-axis -350
    const width2 = this.element.nativeElement.clientWidth; // this is to auto adjust the height of X-axis - 752
    this.margin = { top: 20, right: 20, bottom: 20, left: 20 };
    // this.width = height2;
    // this.height = width2;
    this.datac = {
      //labels: labels,
      datasets: [
        {
          label: "",
          data: this.data,
          backgroundColor: this.colors,
          barPercentage: 0.3,
          borderWidth: 1,
          borderSkipped: false,
          legand: false,
        },
      ],
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

    // Function to resize the canvas text
    function vw(v) {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      if (window.innerWidth >= 768) {
        return (v * vw) / 100;
      } else {
        v = 1.5;
        return (v * vw) / 100;
      }
    }

  
    const label = (context) => {
      if(!this.period){
      const fromTime = new Date(JSON.parse(context.formattedValue)[0]).toLocaleTimeString();
      return `From: ${fromTime}`;
      }else{
        const Datef = new Date(JSON.parse(context.formattedValue)[0]).toDateString();
        return Datef
      }
    };
    
    const afterLabel = (context) => {
      if(!this.period){
      const toTime = new Date(JSON.parse(context.formattedValue)[1]).toLocaleTimeString();
      return `To: ${toTime}`;
      }
    };
    
    
    
    

    const todayLine = {
      id: "todayLine",
      afterDatasetsDraw(chart, args, pluginOptions) {
        if(!self.period){
          const { ctx, data, chartArea, scales } = chart;
          var desiredStartTime = new Date(self.fromTime);
          var desiredEndTime = new Date(self.toTime);
          var desiredStartTimePixel =
            chart.scales.x.getPixelForValue(desiredStartTime);
          var desiredEndTimePixel =
            chart.scales.x.getPixelForValue(desiredEndTime);
          ctx.save();
          ctx.fillStyle = "rgba(173, 216, 230, 0.5)";
          ctx.fillRect(
            desiredStartTimePixel,
            chartArea.top,
            desiredEndTimePixel - desiredStartTimePixel,
            chartArea.bottom - chartArea.top
          );
          ctx.restore();
        }
        if(self.period) {
          const { ctx, data, chartArea, scales } = chart;
          const period = self.period;
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to the first day (Sunday) of the current week
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 6); // Set to the last day (Saturday) of the current week
        
          const startDatePixel = chart.scales.x.getPixelForValue(startDate);
          const endDatePixel = chart.scales.x.getPixelForValue(endDate);
        
          ctx.save();
        
          for (let i = 0; i < period.length; i++) {
            if (period[i] === "1") {
              const day = new Date(startDate);
              day.setDate(day.getDate() + i); // Set to the current day
        
              const dayStartPixel = chart.scales.x.getPixelForValue(day);
              const dayEndPixel = chart.scales.x.getPixelForValue(day) + (endDatePixel - startDatePixel) / 7;
        
              const desiredStartTime = new Date(day);
              const desiredEndTime = new Date(day);
              desiredStartTime.setHours(0, 0, 0, 0); // Set to 00:00:00
              desiredEndTime.setHours(23, 59, 59, 999); // Set to 23:59:59
             
              var desiredStartTimePixel =chart.scales.x.getPixelForValue(desiredStartTime);
              var desiredEndTimePixel =chart.scales.x.getPixelForValue(desiredEndTime);
              ctx.save();
              ctx.fillStyle = "rgba(173, 216, 230, 0.5)";
              ctx.fillRect(
                desiredStartTimePixel,
                chartArea.top,
                desiredEndTimePixel - desiredStartTimePixel,
                chartArea.bottom - chartArea.top
              );
            }
          }
        
          ctx.restore();
        }   
        
      }
      
    };

    const xAxixPadding = {
      id: "xAxixPadding",
      beforeDatasetsDraw(chart, args, pluginOptions) {
        const {
          ctx,
          data,
          chartArea,
          scales: { x, y },
        } = chart;
        chart["scales"]["x"]["_labelItems"].forEach((label, index) => {
          label.font.family = "bosch-Bold";
          label.textAlign = "left";
        });
      },
    };

    this.xAxis["ticks"]["font"] = {
      style: "normal",
      weight: "bold",
      size: vw(0.74),
    };

    //const chart=self.chartObj
    self.chartObj = new Chart(self.id, {
      type: "bar",
      data: this.datac,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        scales: {
          x: this.xAxis,
          y: this.yAxis,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            xAlign: 'center',
            yAlign: 'top',
            caretPadding:10,
            callbacks: {
              label: label,
              afterLabel:afterLabel
            },
            titleFont: {
              size:vw(0.9),
            },
            bodyFont: {
              size:vw(0.9),
            }
          }
        },
        onHover: (element , chart) => {
          element["native"]["target"]["style"]["cursor"] = chart[0] ? 'pointer' : 'default';
        }
      },
      plugins: [todayLine,xAxixPadding],
    });

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
