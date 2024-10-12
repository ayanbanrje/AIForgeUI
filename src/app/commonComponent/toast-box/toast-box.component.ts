import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-box',
  templateUrl: './toast-box.component.html',
  styleUrls: ['./toast-box.component.scss']
})

export class ToastBoxComponent {

  constructor(public toast: ToastService) { }



}
