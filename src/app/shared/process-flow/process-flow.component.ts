/**
 * Author:Pavithra
 * Reviewd by:
 * Process flow screen component
 */
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-process-flow',
  templateUrl: './process-flow.component.html',
  styleUrls: ['./process-flow.component.scss']
})
export class ProcessFlowComponent implements OnInit, OnChanges {
  @Input() active;
  @Input() status;
  activeClass = 'location-details';
  process: Array<any> = [
    {
      icon: 'bosch-ic-building',
      label: 'Add Location Details',
      id: 'ov',
      class: 'location-details',
      name: 'Add Location Details'
    },
    {
      icon: 'bosch-ic-history',
      label: 'Define Operating Time',
      id: 'ot',
      class: 'operating-time',
      name: 'Define Operating Time'
    },
    {
      icon: 'bosch-ic-it-device',
      label: 'Add Phantom Device',
      id: 'ip',
      class: 'phantom-device',
      name: 'Add Phantom Device'
    },
    {
      icon: 'bosch-ic-it-device',
      label: 'Add Device Mapping',
      id: 'dm',
      class: 'device-mapping',
      name: 'Add Device Mapping'
    },
    {
      icon: 'bosch-ic-appliance-sun',
      label: 'Add & Map Appliances',
      id: 'ma',
      class: 'map-appliances',
      name: 'Add & Map Appliances'
    }
  ];
  isOPS = false;
  constructor(
    private router: Router,
    private app: AppService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.check();
    this.tab();
  }

  ngOnChanges() {
    this.check();
    this.tab();
  }

  check() {
    this.isOPS = this.app.user.role === 'opsuser';
    if (this.active) {
      const activeProcess = this.process.find(p => p.id === this.active);
      this.activeClass = activeProcess.class;
    }
    this.router.events.subscribe((event: any) => {
      if (event && event.url) {
        this.tab();
      }
    });
  }

  tab() {
    this.process = this.process.filter(t => t.id !== 'ug');
    if (!this.isOPS) {
      this.process.push(
        {
          icon: 'bosch-ic-user-add',
          label: 'Add User & Groups',
          id: 'ug',
          class: 'user-groups'
        }
      );

      // this.process.find(tab => tab.label === 'Add User & Groups').label = this.translate.instant('Add_User_&_Groups');
    }

    // if (this.process[0].label === 'Add Location Details') {
    // this.process.find(tab => {
    //   if (tab.label === 'Add Location Details') {
    //     tab.label = this.translate.instant('Add_Location_Details');
    //   }
    //   if (tab.label === 'Define Operating Time') {
    //     tab.label = this.translate.instant('Define_Operating_Time');
    //   }
    //   if (tab.label === 'Add Phantom Device') {
    //     tab.label = this.translate.instant('Add_Phantom_Device');
    //   }
    //   if (tab.label === 'Add Device Mapping') {
    //     tab.label = this.translate.instant('Add_Device_Mapping');
    //   }
    //   if (tab.label === 'Add & Map Appliances') {
    //     tab.label = this.translate.instant('Add_&_Map_Appliances');
    //   }
    // });
    // }
  }
}

