import { Component, OnChanges } from "@angular/core";
import { MessageService } from "../../services/message.service";

@Component({
  selector: "app-message-box",
  templateUrl: "./message-box.component.html",
  styleUrls: ["./message-box.component.scss"],
})
export class MessageBoxComponent {
  constructor(public message: MessageService) { }

  close() {
    this.message.show = false;
    if (this.message.xAction) {
      this.message.xAction();
    }
  }

  confirmYes() {
    this.message.yes.action();
    this.message.show = false;
  }

  confirmNo() {
    this.message.no.action();
    this.message.show = false;
  }
}
