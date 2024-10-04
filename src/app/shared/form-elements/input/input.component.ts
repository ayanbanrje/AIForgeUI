import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import * as moment from "moment-timezone";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
})
export class InputComponent implements OnInit {
  @Input() value;
  @Input() width: string= "100%";
  @Input() height: string = "auto";
  @Input() placeHolder = "";
  @Input() type = "text";
  @Input() disabled = false;
  @Input() label = "";
  @Input() textAlign: string;
  @Input() color: string;
  @Input() fontWeight: string;
  @Input() fontFamily: string;
  @Input() fontSize: string;
  @Input() inputBoxType: "SEARCH" | "INPUT" = "INPUT";
  @Output() valueChange = new EventEmitter();
  @Input() verticalInput = false;
  @Input() require = false;
  @Input() suffix = false;
  @Input() suffixValue = null;
  @Input() backgroundColor = "#E0E2E5";
  @Input() totalHeight = "auto";
  @Input() deviceMapping = false;
  @Input() fromAppliances = false;
  @Input() fromSignatures = false;
  @Input() installationDevices = false;
  @Input() alertsNotification: false;
  @Input() padding: string;
  @Input() isCalendar = false;
  @Input() max;
  @Input() selectedTime;
  @Output() updatedFromTIME = new EventEmitter();
  pickerType = "both";
  @Input() showSensor;
  @Input() title= "";
  
  constructor() {

  }

  ngOnInit(): void {
    this.value = this.value ? this.value : "";
  }

  updateInputValue() {
    this.valueChange.emit(this.value);
  }

  datePickerOpened() {
    let self = this;
    setTimeout(() => {
      this.changeDatePickerType();
    }, 100);
    document
      .querySelector(".owl-dt-calendar-control")
      .addEventListener("click", () => {
        self.changeDatePickerType();
      });
  }

  changeDatePickerType() {
    let self = this;
    let tabSelected = self.showSensor;
    let j = document.querySelectorAll(".owl-dt-calendar-cell");
    for (var i = 0; i < j.length; i++) {
      j[i].addEventListener("click", function (event) {
        if (
          document.querySelectorAll(".owl-dt-calendar-cell-range-to").length > 0
        ) {
          if (
            document.querySelectorAll(".owl-dt-calendar-cell-in-range")
              .length <= 21
          ) {
            event.preventDefault();
            self.pickerType = "both";
            document.querySelector<HTMLElement>(".owl-dt-timer").style.display =
              "block";
            document.querySelector<HTMLElement>(
              ".owl-dt-timer"
            ).style.textAlign = "center";
            document.querySelector<HTMLElement>(
              ".owl-dt-container-info"
            ).style.display = "block";
            self.incrementHourTimer(23);
            self.incrementMinuteTimer(59);
          } else {
            self.pickerType = (tabSelected === true) ? "both" : "calendar";
            //document.querySelector<HTMLElement>(".owl-dt-timer").style.display = "none";
            //document.querySelector<HTMLElement>(".owl-dt-container-info").style.display = "none";
            setTimeout(() => {
              (<HTMLInputElement>(
                document.querySelectorAll(".owl-dt-container-control-button")[1]
              ))?.click();
            });
          }
        } else {
          self.pickerType = "both";
          //set time picker hour and minute to zero
          let existingHour = parseInt(
            (<HTMLInputElement>(
              document.querySelectorAll(".owl-dt-timer-input")[0]
            )).value
          );
          let existingMinute = parseInt(
            (<HTMLInputElement>(
              document.querySelectorAll(".owl-dt-timer-input")[1]
            )).value
          );
          for (let i = existingHour; i > 0; i--) {
            //set hour to zero
            setTimeout(function () {
              (<HTMLInputElement>(
                document.querySelectorAll(".owl-dt-control-arrow-button")[3]
              ))?.click();
            });
          }
          for (let i = existingMinute; i > 0; i--) {
            // set minute to zero
            setTimeout(function () {
              (<HTMLInputElement>(
                document.querySelectorAll(".owl-dt-control-arrow-button")[5]
              ))?.click();
            });
          }
        }
      });
    }
  }

  incrementHourTimer(i) {
    setTimeout(() => {
      if (
        parseInt(
          (<HTMLInputElement>(
            document.querySelectorAll(".owl-dt-timer-input")[0]
          )).value
        ) != 23
      ) {
        (<HTMLInputElement>(
          document.querySelectorAll(".owl-dt-control-arrow-button")[2]
        ))?.click();
      }
    });
    if (i != 1) {
      this.incrementHourTimer(i - 1);
    }
  }
  incrementMinuteTimer(i) {
    setTimeout(() => {
      if (
        parseInt(
          (<HTMLInputElement>(
            document.querySelectorAll(".owl-dt-timer-input")[1]
          )).value
        ) != 59
      ) {
        (<HTMLInputElement>(
          document.querySelectorAll(".owl-dt-control-arrow-button")[4]
        ))?.click();
      }
    });
    if (i != 1) {
      this.incrementMinuteTimer(i - 1);
    }
  }

  getTime(selectedTime) {
    return moment(selectedTime).format("YYYY-MM-DD hh:mm:ss A");
  }
}
