/**
 * Component for dropdown with single and multi selection
 *
 * @summary dropdown component
 * @author Lavanya R [LVR5KOR]
 *
 * Created at     : 2018-12-10 16:41:47
 * Last modified  : 2018-12-12 10:37:50
 */

import {
  Component,
  ViewChild,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "lodash";
import { BasicDetailsService } from "src/app/services/basic-details.service";
@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
})
export class DropdownComponent implements OnChanges, AfterViewInit {
  @ViewChild("myDropdown", { static: false }) dropdown: ElementRef;
  @ViewChild("options", { static: false }) options: ElementRef;

  @Input() defaultLabel = "Select";
  @Input() count = false;
  @Input() list: Array<any> = [{ key: 0, view: "-" }];
  @Input() value: any = null;
  @Input() multiselect = false;
  @Input() checkbox = false;
  @Input() key = "key";
  @Input() view = "view";
  @Input() width = "auto";
  @Input() height;
  @Input() inlineRemove = false;
  @Input() showFilter = false;
  @Input() maxOverflow = "200px";
  @Input() selected = [];
  @Input() disabled = false;
  @Input() label;
  @Output() selectedChange = new EventEmitter();
  @Input() form = false;
  @Input() class = "";
  @Input() tooltip = false;
  @Input() info;
  @Input() deselect = false;
  @Input() sort = false;
  @Input() demo = false;
  @Input() rtm = false;
  @Input() ra = false;
  @Input() test = false;
  @Input() phatomDevice = false;
  @Input() appliances = false;
  @Input() targetOption = false;
  @Input() addQuery = false;
  @Input() isEneryConsuption = false;
  @Input() intervalOption = false;
  @Input() isLanguage = false;
  @Input() isFromPaginator = false;
  @Input() isFromAppliance = false;
  @Input() tableDropDown = false;
  @Input() phantomItem = false;
  @Input() targetEnergy = false;
  @Input() isLoaction = false;
  @Input() marginTop = "2.5rem";
  @Input() backgroundColor = "#e0e2e5";
  @Input() maxWidth: any = "100%";
  multiselectLabel = "";
  position = 0;
  filterText: Array<any> = [];
  searchText = "";
  currentQuery;
  visible = false;
  toggle = false;
  minWidth = this.maxWidth;
  @Input() multiTree = false;
  @Input() subMenu: Array<any> = [{ key: 0, view: "-" }];
  subMenuChecked = false;
  selectedList;
  @Output() updateList = new EventEmitter();
  @Input() isMultiTreeWithOnlyHeader = false;
  @Input() selectedAll = null;
  @Input() selctAllType = "";
  selectedType = "all" || "some" || "none" ; 
  
  constructor(
    private translate: TranslateService,
    private basicDetailsService: BasicDetailsService,
    ) { }

  ngOnChanges() {
    if (this.list) {
      let totalCheckLen = 0;
      this.list = this.list.filter((li, i) => {
        if (li.visible == 0) {
          return false;
        }
        if(li.checked === true) {
          totalCheckLen++;
        }
        li.key = li[this.key];
        li.view = li[this.view];
        li._idx = "dropdown_option" + i;
        return li;
      });

      let styleCount = 0;
      this.list.map((h)=>{
        if(h.key !== ' Select All') {
          if(h.checked === true) {
            styleCount++;
          }
        }
      });
      if(styleCount === this.list.length-1) {
        this.selectedType = 'all';
      } else if(styleCount === 0) {
        this.selectedType = 'none';
      } else if(styleCount > 0 && styleCount < this.list.length-1) {
        this.selectedType = 'some';
      }

      if(totalCheckLen === this.list.length) {
          if(!this.basicDetailsService.isFromOnboarding) {
            localStorage.setItem(`${this.selctAllType}`,this.selctAllType);
            if(this.list.length===0){
              localStorage.removeItem(`${this.selctAllType}`);
            }
          } else {
            this.basicDetailsService.isFromOnboarding = false;
          }
      }
      this.visible = true;
      if (this.checkbox) {
        // this.multiselect = true;
      }
      if (this.multiselect) {
        this.value = [];
      }
      if (this.selected) {
        this.value = this.selected;
        if (this.value._idx && this.list && this.list.length && !this.isMultiTreeWithOnlyHeader && !this.multiselect) {
          this.list.map((j) => {
            j.checked = false;
          });
          this.list.map((l)=>{
            if(l.key === this.value.key && l._idx.toLowerCase() !== this.value._idx.toLowerCase()) {
            this.value["_idx"] = this.list.find(
              (l) => l.key === this.value.key
            )._idx;
            }
          });

          this.list.find(
            (l) => l._idx.toLowerCase() === this.value._idx.toLowerCase()
          ).checked = true;
        }
        if (this.value && this.list && this.list.length && this.isMultiTreeWithOnlyHeader) {
          this.list.map(l => {
            l.subMenu.map(e => e.checked = false);
          });
          this.list.forEach(l => {
            l.subMenu.forEach(e => {
              if (e.label.toLowerCase() === this.value.label.toLowerCase()) {
                e.checked = true;
              }
            });
          });
        }
        if (this.value && this.list && this.list.length && this.multiselect) {
          let checkedValue = false;
          
          if(this.selectedAll !== null) {
            if(localStorage.getItem(`${this.selctAllType}`)) {
              checkedValue = true;
            }

            let styleCount = 0;
            this.list.map((h)=>{
              if(h.key !== ' Select All') {
                if(h.checked === true) {
                  styleCount++;
                }
              }
            });
            if(styleCount === this.list.length-1) {
              this.selectedType = 'all';
            } else if(styleCount === 0) {
              this.selectedType = 'none';
            } else if(styleCount > 0 && styleCount < this.list.length-1) {
              this.selectedType = 'some';
            }

            if(totalCheckLen === this.list.length) {
              if(!this.basicDetailsService.isFromOnboarding) {
                checkedValue = true;
              }
            }
          }
          this.list = this.list.filter((f)=>f.view != ' Select All');
            if(this.list.length) {
              this.list.unshift({
                value: " Select All",
                key: " Select All",
                visible: 1,
                checked: checkedValue,
                view: " Select All",
                _idx: "dropdown_option00",
              });
            }
            this.list = this.list.filter((l)=> l.key !== undefined && l.view !== undefined);
           
            if(this.selectedAll !== null) {
              if(localStorage.getItem(`${this.selctAllType}`)) {
                this.value = this.list.map((m)=>{
                  m.checked = true;
                  return m;
                });
              }

              let styleCount = 0;
              this.list.map((h)=>{
                if(h.key !== ' Select All') {
                  if(h.checked === true) {
                    styleCount++;
                  }
                }
              });
              if(styleCount === this.list.length-1) {
                this.selectedType = 'all';
              } else if(styleCount === 0) {
                this.selectedType = 'none';
              } else if(styleCount > 0 && styleCount < this.list.length-1) {
                this.selectedType = 'some';
              }

              if(totalCheckLen === this.list.length) {
                this.value = this.list.map((m)=>{
                  m.checked = true;
                  return m;
                });
              }
            }
          this.value.forEach((val, index) => {
            this.list.find((l) => {
              if (l?._idx?.toLowerCase() === val?._idx?.toLowerCase()) {
                this.value[index].checked = true;
              }
            }
            )
          });

          let labels = this.value.map((l) => {
            return l[this.key];
          });
          labels = labels.filter((f)=> f !== undefined);
          this.multiselectLabel = labels && labels.length ? labels.toString() : "";
        }
      } else {
        this.value = null;
      }
      if (this.sort) {
        this.filterText = _.sortBy(this.list, "view");
      }

      if(this.multiselect) {
        let checkedValue = false;
        
        if(this.selectedAll !== null) {
          if(localStorage.getItem(`${this.selctAllType}`)) {
            checkedValue = true;
          }

          let styleCount = 0;
          this.list.map((h)=>{
            if(h.key !== ' Select All') {
              if(h.checked === true) {
                styleCount++;
              }
            }
          });
          if(styleCount === this.list.length-1) {
            this.selectedType = 'all';
          } else if(styleCount === 0) {
            this.selectedType = 'none';
          } else if(styleCount > 0 && styleCount < this.list.length-1) {
            this.selectedType = 'some';
          }

          if(totalCheckLen === this.list.length) {
            checkedValue = true;
          }
        }
        this.filterText = this.filterText.filter((f)=>f.view != ' Select All');
        if(this.filterText.length) {
          this.filterText.unshift({
            value: " Select All",
            key: " Select All",
            visible: 1,
            checked: checkedValue,
            view: " Select All",
            _idx: "dropdown_option00",
          });
        }
        this.filterText = this.filterText.filter((l)=> l.key !== undefined && l.view !== undefined);

        this.list = this.list.filter((f)=>f.view != ' Select All');
        if(this.list.length) {
          this.list.unshift({
            value: " Select All",
            key: " Select All",
            visible: 1,
            checked: checkedValue,
            view: " Select All",
            _idx: "dropdown_option00",
          });
        }
        this.list = this.list.filter((l)=> l.key !== undefined && l.view !== undefined);
      }
    }
  }

  ngAfterViewInit() {
    const self = this;
    if (self.dropdown) {
      // tslint:disable-next-line:only-arrow-functions
      document.addEventListener(
        "mouseup",
        function (e) {
          const container = self.dropdown.nativeElement;
          if (!container.contains(e.target)) {
            self.toggle = false;
          }
        }.bind(this)
      );
    }
  }

  makeSearch(searchText) {
    const self = this;
    if (searchText && searchText.length >= 3) {
      const selected = Object.assign([], self.list).filter(
        (item) =>
          item[self.view]?.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
      );
      self.filterText = selected;
    } else {
      self.filterText = self.list;
    }
    if (this.sort) {
      this.filterText = _.sortBy(self.filterText, "view");
    }
  }

  toggleClass() {
    const self = this;
    if (!self.disabled) {
      self.toggle = !self.toggle;
      self.searchText = "";
      if (!self.selected) {
        self.list.forEach((l) => (l.checked = false));
      }
      self.filterText = self.list;
      if (this.sort) {
        this.filterText = _.sortBy(this.list, "view");
      }
      self.position = 0;
      window.setTimeout(() => {
        const optionHeight = self.dropdown.nativeElement.scrollHeight;
        const elementBound =
          self.dropdown.nativeElement.getBoundingClientRect();
        const bodyBound = document
          .getElementsByTagName("body")[0]
          .getBoundingClientRect();
        const elementBottom = elementBound.bottom;
        const bodyBottom = bodyBound.bottom;
        const pos = bodyBottom - elementBottom;
        self.position = pos < optionHeight ? 0 - optionHeight : 53;
      }, 0);
    }
  }
  removeValue(v) {
    this.value = this.value.filter((vx) => {
      return vx._idx !== v._idx;
    });
    this.list.forEach((vx) => {
      if (vx._idx === v._idx) {
        vx.checked = false;
      }
    });
  }
  removeSingleValue() {
    this.selected = [];
    this.selectedChange.emit("");
    this.value = null;
    this.toggleClass();
  }
  updateModel(list, i?) {
    let tempList = this.list.filter((f)=> f.key !== " Select All");
    if (i === undefined) {
      if (!this.multiselect) {
        const isChecked = list.checked;
        this.list.map((l) => (l.checked = false));
        list.checked = this.deselect ? !isChecked : true;
        this.list = this.list.map((m) => {
          if (m.subMenu !== undefined && m.subMenu === true) {
            m.subMenuList = m.subMenuList.map((n) => {
              n.checked = false;
              return n;
            });
          }
          return m;
        });
        this.value = list.checked ? list : null;
        this.toggleClass();
        this.updateList.emit(this.list);
      } else {
        list.checked = !list.checked;
        if (!this.value) {
          this.value = [];
        } {
          if(list.key === " Select All") {
            if(list.checked === true) {
              localStorage.setItem(`${this.selctAllType}`,this.selctAllType);
            } else {
              localStorage.removeItem(`${this.selctAllType}`);
            }
            
            if(localStorage.getItem(`${this.selctAllType}`)) {
              this.value = this.list.map((m)=>{
                m.checked = list.checked;
                return m;
              })
            } else {
              this.value = this.value.map((m)=>{
                m.checked = list.checked;
                return m;
              })
            }
          } else {
            localStorage.removeItem(`${this.selctAllType}`);
            this.value = this.list.map((m)=>{
              if(m.key === " Select All") {
                m.checked = false;
              }
              return m;
            });
            
          }
        }
        this.value = this.list.filter((lc) => {
          return lc.checked;
        });
        let labels = this.value.map((l) => {
          return l[this.key];
        });
        labels = labels.filter((f)=> f !== undefined);
        this.multiselectLabel =
          labels && labels.length ? labels.toString() : "";
        // this.toggleClass();
        this.list = this.list.filter((f)=>f.view != ' Select All');
        this.updateList.emit(this.list);
      }
      if(this.multiselect) {
        this.value = this.value.filter((f)=>f.view != ' Select All');
        this.selectedChange.emit(this.value);
      } else {
        this.selectedChange.emit(this.value);
      }
    } else {
      const isChecked = list.checked;
      this.selectedList = list;
      this.list.map((l) => (l.checked = false));
      list.checked = this.deselect ? !isChecked : true;
      this.value = list.checked ? list : null;
      this.list = this.list.map((m) => {
        if (
          m.subMenu !== undefined &&
          m.subMenu === true &&
          m.checked === false
        ) {
          m.subMenuList = m.subMenuList.map((n) => {
            n.checked = false;
            return n;
          });
        }
        return m;
      });
      this.updateList.emit(this.list);
      if (this.value === null) {
        // this.toggleClass();
        this.selectedChange.emit(this.value);
      } else {
        this.selectedChange.emit(this.value);
      }
    }
  }

  updateRadio(ev, e) {
    this.selectedList = this.list.find((f)=> f.checked === true);
    if(this.selectedList && this.selectedList.subMenu === true && !this.selectedList.subMenuList.find((f)=> f.name === e.name)) {
      this.selectedList = undefined;
    } else if(this.selectedList && this.selectedList.subMenu === false) {
      this.selectedList = undefined;
    }
    if(this.selectedList === undefined) {
      this.list = this.list.map((f)=> {
        f.checked = false;
        if(f.subMenu === true) {
          f.subMenuList = f.subMenuList.map((n) => {
            n["checked"] = false;
            return n;
          });
        }
        return f;
      });

      this.list = this.list.map((m,i)=>{
        if(m.subMenu === true) {
          if(m.subMenuList.find((f)=> f.name === e.name)) {
            m.checked = true;
          }
          if(m.selectType !== undefined && m.selectType === "single") {
            m.subMenuList = m.subMenuList.map((v) => {
              v["checked"] = false;
              return v;
            });
            m.subMenuList = m.subMenuList.map((n) => {
              if (n.key === e.key) {
                n["checked"] = ev;
              }
              return n;
            });
          } else {
            m.subMenuList = m.subMenuList.map((n) => {
              if (n.key === e.key) {
                n["checked"] = ev;
              }
              return n;
            });
          }
        }
        return m;
      })
      this.selectedList = this.list.find((f)=> f.checked === true);
    } else {
      this.list = this.list.map((m) => {
        if (m.key === this.selectedList?.key && m.subMenu === true) {
          if(m.selectType !== undefined && m.selectType === "single") {
            m.subMenuList = m.subMenuList.map((v) => {
              v["checked"] = false;
              return v;
            });
            m.subMenuList = m.subMenuList.map((n) => {
              if (n.key === e.key) {
                n["checked"] = ev;
              }
              return n;
            });
          } else {
            m.subMenuList = m.subMenuList.map((n) => {
              if (n.key === e.key) {
                n["checked"] = ev;
              }
              return n;
            });
          }
        }
        return m;
      });
    }
    this.selectedChange.emit(
      this.list.find((f) => f.key === this.selectedList?.key)
    );
  }

  updateModelMultiTree(subMenu) {
    this.list.map((l) => {
      l.subMenu.map((e) => {
        e.checked = false;
      });
    });
    this.list.map((l) => {
      l.subMenu.map((e) => {
        if (e.label === subMenu.label) e.checked = true;
      });
    });
    this.value = subMenu;
    this.toggleClass();
    this.selectedChange.emit(this.value);
  }

  getfilterText() {
    let res = this.filterText;
    let trueArr = [];
    let falseArr = [];
    let selectAll = {};
    if (res.some((s) => s.value === " Select All")) {
      res = res.map((m)=> {
        if(m !== null) {
          if (m.value === " Select All") {
            selectAll = m;
            m = null;
          } else if (m.checked === true) {
            trueArr.push(m);
            m = null;
          } else if (m.checked === false) {
            falseArr.push(m);
            m = null;
          }
        }
        return m;
      });
      let joinArr = [selectAll,...trueArr,...falseArr];
      return joinArr;
    } else {
      return this.filterText;
    }
  }
}