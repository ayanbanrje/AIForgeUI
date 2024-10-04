import { Component, Input, OnChanges, Output, EventEmitter, OnInit, DoCheck } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AppServiceHelper } from 'src/app/helpers/app.helper.service';
import { environment } from '.././../../../environments/environment';

@Component({
  selector: 'app-form-designer',
  templateUrl: './form-designer.component.html',
  styleUrls: ['./form-designer.component.scss']
})
export class FormDesignerComponent implements OnInit, OnChanges , DoCheck {
  form: FormGroup;
  @Input() header;
  @Input() json: Array<any> = [];
  @Input() data;
  @Input() disabled = false;
  @Output() dataChange = new EventEmitter();
  @Input() margin: string;
  @Input() isSaved = false;
  @Input() isValidEmail = true;
  @Input() isvalidPassword = true;
  @Input() isPasswordSame = true;
  @Input() isValidCode = true;
  @Input() isCredValid = true;
  @Input() isValidChangePwd = true;
  @Output() check = new EventEmitter();
  @Output() klick = new EventEmitter();
  floors: Array<any>;
  fileDownloadBucket = environment.FILESBUCKET;
  password = "";
  newPasword = "";
  reEnterPassword = "";
  isDesktopView = false;
  
  constructor(private appHelper: AppServiceHelper, private translate: TranslateService) { }
  ngDoCheck() {
    if(window.innerWidth <= 768 ) {
      this.isDesktopView = true;
    } else {
      this.isDesktopView = false;
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.setUp();
    if(this.form.controls["PASSWORDTEMP"] !== undefined) {
      this.form.controls["PASSWORDTEMP"].setValue(this.password);
    }
    if(this.form.controls["PASSWORD"] !== undefined) {
      this.form.controls["PASSWORD"].setValue(this.password);
    }
    if(this.form.controls["newPassword"] !== undefined) {
      this.form.controls["newPassword"].setValue(this.newPasword);
    }
    if(this.form.controls["newPasswordTemp"] !== undefined) {
      this.form.controls["newPasswordTemp"].setValue(this.newPasword);
    }
    if(this.form.controls["reEnterNewPassword"] !== undefined) {
      this.form.controls["reEnterNewPassword"].setValue(this.reEnterPassword);
    }
    if(this.form.controls["reEnterNewPasswordTemp"] !== undefined) {
      this.form.controls["reEnterNewPasswordTemp"].setValue(this.reEnterPassword);
    }
  }

  setUp() {
    this.form = this.createFormGroup(this.json, this.data);
    if (this.disabled) {
      this.form.disable();
    }
    let self = this;
    let valueChangedForField = {};
    this.json.forEach(j => {
      if (j.id) {
        self.form.get(j.id).valueChanges.subscribe(x => {
          valueChangedForField = {
            id: j.id,
            value: x
          }
        })
      }
    })

    const status = this.form.status === 'INVALID' ? false : true;
    this.check.emit(status);
    this.form.valueChanges.subscribe(data => {
      for (const d in data) {
        if (d) {
          this.data = this.data ? this.data : {};
          this.data[d] = data[d];
        }
      }
      const changeStatus = this.form.status === 'INVALID' ? false : true;
      this.check.emit(changeStatus);
      const parsedData = this.appHelper.resetMapping(data);
      for (const p in parsedData) {
        if (p && typeof parsedData[p] === 'object') {
          parsedData[p] = parsedData[p].key;
        }
      }
      this.data.valueChanged = valueChangedForField;
      this.dataChange.emit(this.data);
    });
  }

  createFormGroup(json, data) {    
    const group: any = {};
    if (!data) {
      data = {};
    }
    json.forEach(j => {
      const type = j.type;
      const id = j.id;
      let value = data[id] ? data[id] : '';
      if (j && id) {
        if (type && type === 'select') {
          j.options.filter(o => {
            if (o[j.key] === value) {
              value = o;
              o.checked = true;
            }
          });
        }
        group[id] = j.required ? new FormControl(value || '', Validators.required) : new FormControl(value || '');
      }
    });
    return new FormGroup(group);
  }

  toggle(selected, items) {
    this.form.controls[items.id].setValue(selected.key ? selected.key : selected.label);
  }

  onFileChange($event, id) {
    const file = $event.target.files[0];
    this.form.controls[id].setValue(file ? file.name : '');
  }

  updateDropdown(item, value) {
    if(value === null) {
      value = {key : null }
    }
    this.form.controls[item.id].setValue(value);
    if (item.change) {
      item.change(value);
    }
  }

  updateRadio(item, value) {
    this.form.controls[item.id].setValue(value);
    if (item.change) {
      item.change(value);
    }
  }

  updateOT($event, id) {
    this.form.controls[id].setValue($event);
  }

  updateDL($event, id) {
    this.form.controls[id].setValue($event);
  }

  updateNumSelect(item, value) {
    this.form.controls[item.id].setValue(value);
    if (item.change) {
      item.change(value);
    }
  }
  
  get f() {
    return this.form.controls;
  }

  sendVerifcationCode() {
    this.klick.emit();
  }

  changeValue(event) {
    if(event === "PASSWORD") {
      this.password = this.form.controls[event].value;
    } else if(event === "newPassword") {
      this.newPasword = this.form.controls[event].value;
    } else if(event === "reEnterNewPassword") {
      this.reEnterPassword = this.form.controls[event].value;
    } else if(event === "PASSWORDTEMP") { 
      this.password = this.form.controls[event].value;
    } else if(event === "newPasswordTemp") {
      this.newPasword = this.form.controls[event].value;
    } else if(event === "reEnterNewPasswordTemp") {
      this.reEnterPassword = this.form.controls[event].value;
    }
  }
}


