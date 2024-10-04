/**
 * @author [SBA5COB] Sivaprakasharavi Baskaran
 * @email [Sivaprakasharavi.Baskaran@in.bosch.com]
 * @create date 2019-10-07 12:59:02
 * @modify date 2019-10-07 12:59:02
 * @desc [basic default selection for filter and to add new list of customers]
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ɵConsole,
} from "@angular/core";
import { CountriesService } from "src/app/services/backend/countries.service";
import { Constants } from "../../../constants";
import { AppService } from "src/app/services/app.service";
import { JsonService } from "src/app/services/json.service";
import { CustomersService } from "src/app/services/backend/customers.service";
import { TranslateService } from "@ngx-translate/core";
import { AppServiceHelper } from "src/app/helpers/app.helper.service";
import { input } from "aws-amplify";
import * as _ from "lodash";

@Component({
  selector: "app-basic-details",
  templateUrl: "./basic-details.component.html",
  styleUrls: ["./basic-details.component.scss"],
})
export class BasicDetailsComponent implements OnInit, OnChanges {
  spaces: Array<any> = Constants.space;
  SPACE_TYPE;
  STORE_NAME;
  cities: Array<any> = [];
  CITY;
  countries: Array<any> = [];
  COUNTRY;
  stores: Array<any> = [
    {
      NAME: "BOSCH DEMO",
    },
  ];
  STORE;
  @Input() demo = false;
  @Input() rtm = false;
  @Input() ra = false;
  @Input() showStore = false;
  @Input() header: string;
  @Input() nav: boolean;
  @Output() back = new EventEmitter();
  @Input() disabled = false;
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter();
  @Input() defaults = "Select";
  @Input() labels = {
    country: "Country",
    space: "Space Type",
    city: "Location",
    stores: "Facility",
  };
  @Input() count = {
    country: 0,
    space: 0,
    city: 0,
    store: 0,
  };
  @Input() rNaFilerSelected: boolean = true;
  @Input() showAllStore = false;
  @Input() onboardingStoreId = 0;
  @Input() reportNanalysis = false;
  @Input() maxWidth = '350px';
  @Input() dropDownWidth = '100%';
  @Input() dropDownHeight = '2.5vw';
  @Input() ranDropdown = false;

  isCityToType: boolean = false;
  entireCityList = [];
  entireStoreList = [];
  countryCount = 0;
  cityCount = 0;
  storeCount = 0;
  firstStore = true;
  callPreLoad = true;


  constructor(
    private countriesService: CountriesService,
    public app: AppService,
    private json: JsonService,
    private customer: CustomersService,
    private translate: TranslateService,
    private appHelper: AppServiceHelper
  ) { }

  async ngOnInit() {
    //console.log("A")
    await this.preLoad();
    await this.load();
    //console.log("ngOnInit")
  }

  async ngOnChanges() {
    //console.log("B")
    // if (this.data && this.data.STORES) {
    //   this.entireStoreList = this.data.STORES;
    //   this.storeCount = this.data.STORES.length;
    // }
    // if (localStorage.getItem("newStoreID") !== undefined && localStorage.getItem("newStoreID") !== null) {
    //   // console.log(localStorage.getItem("newStoreID") , this.data)
    //   this.data.STORES.find((f) => {
    //     if (f.STORE_ID === Number(localStorage.getItem("newStoreID"))) {
    //       // console.log(f)
    //       this.STORE = f;
    //       return;
    //     }
    //   });
    //   // console.log(this.STORE)
    // } else {
    //   if (this.data && this.data.STORE) {
    //     this.STORE = this.data.STORE;
    //   }
    // }
    // console.log("HERE",this.STORE)

    await this.load();
    //console.log("store count at ngOnChanges", this.entireStoreList.length)
  }

  async preLoad() {
    //console.log("in preload")
    if (this.data) {
      //console.log("basic details preload", this.data)
      this.data.COUNTRIES.filter((countryArr, countryIndex) => {
        if (countryArr.COUNTRY == "undefined") {
          this.data.COUNTRIES.splice(countryIndex, 1);
        }
      });
      this.buildDropdownList(this.data.COUNTRIES);
    }
  }

  async load() {
    //console.log("data", this.data)
    if (this.data) {
      //console.log("basic details", this.data)
      // this.data.COUNTRIES.filter((countryArr, countryIndex) => {
      //   if (countryArr.COUNTRY == "undefined") {
      //     this.data.COUNTRIES.splice(countryIndex, 1);
      //   }
      // });
      // this.buildDropdownList(this.data.COUNTRIES);
      // //console.log("status", this.firstStore)

      this.SPACE_TYPE = this.data.SPACE_TYPE;
      if (this.data.COUNTRY) {
        this.COUNTRY = this.data.COUNTRY;
        this.searchCity();
      }
      if (this.data.CITY) {
        this.CITY = this.data.CITY;
      }
      if (this.data.STORE) {
        this.STORE = this.data.STORE;
      }

      // console.log("this.firstStore", this.firstStore)
      // console.log("typeof this.STORE", typeof this.STORE)
      // console.log("this.showAllStore", this.showAllStore)

      if (
        this.firstStore === true &&
        typeof this.STORE == "undefined" &&
        this.showAllStore === false
      ) {
        //console.log("inside")
        //console.log("this.reportNanalysis", this.reportNanalysis)
        //console.log("this.onboardingStoreId", this.onboardingStoreId)
        if (this.reportNanalysis === true && this.onboardingStoreId != 0) {
          this.data.COUNTRIES.map((countryArr) => {
            countryArr.CITIES.map((cityArr) => {
              cityArr.STORE.map((storeArr, index) => {
                //console.log("storeArr.STORE", storeArr.STORE_ID)
                if (storeArr.STORE_ID && storeArr.STORE_ID == this.onboardingStoreId) {
                  this.storeSelected(storeArr);
                }
              });
            });
          });
        } else {
          //console.log("outside")
          //console.log("this.firstStore", this.firstStore)
          //console.log("typeof this.STORE", typeof this.STORE)
          //console.log("this.showAllStore", this.showAllStore)
          this.updateSelection(this.firstStore);
        }
      } else {
        if (
          this.firstStore === true &&
          typeof this.STORE == "object" &&
          this.showAllStore === false && this.reportNanalysis === true && this.onboardingStoreId != 0
        ) {
          //console.log("rNa", this.reportNanalysis === true)
          this.data.COUNTRIES.map((countryArr) => {
            countryArr.CITIES.map((cityArr) => {
              cityArr.STORE.map((storeArr, index) => {
                //console.log("storeArr.STORE", storeArr.STORE_ID)
                if (storeArr.STORE_ID && storeArr.STORE_ID == this.onboardingStoreId) {
                  this.data.COUNTRIES.map((countryArr) => {
                    countryArr.CITIES.map((cityArr) => {
                      cityArr.STORE.map((storeArr, index) => {
                        // console.log("storeArr.STORE", storeArr.STORE_ID)
                        if (storeArr.STORE_ID && storeArr.STORE_ID == this.onboardingStoreId) {
                          this.storeSelected(storeArr);
                        }
                      });
                    });
                  });
                }
              });
            });
          });
        }
        else {
          if (this.showAllStore === false && this.reportNanalysis === true && this.onboardingStoreId != 0) {
            this.data.COUNTRIES.map((countryArr) => {
              countryArr.CITIES.map((cityArr) => {
                cityArr.STORE.map((storeArr, index) => {
                  // console.log("storeArr.STORE", storeArr.STORE_ID)
                  if (storeArr.STORE_ID && storeArr.STORE_ID == this.onboardingStoreId) {
                    this.storeSelected(storeArr);
                  }
                });
              });
            });
          } else {
            //console.log("this block")
            //console.log("values", this.showAllStore, this.onboardingStoreId, typeof this.STORE, this.STORE, this.CITY.CITY, this.firstStore)
            if (this.showAllStore === true && this.onboardingStoreId === 0 && (typeof this.STORE == "undefined" || typeof this.STORE == "object") && (!this.STORE || this.STORE == null) && this.CITY && this.CITY.CITY) {
              //console.log("Here it is coming")
              this.citySelected(this.CITY)
            } else {
              if (this.showAllStore === false && this.onboardingStoreId != 0) {
                // console.log("this.onboardingStoreId", this.onboardingStoreId)
                // console.log("dashboard from onboarding")
                this.data.COUNTRIES.map((countryArr) => {
                  countryArr.CITIES.map((cityArr) => {
                    cityArr.STORE.map((storeArr, index) => {
                      // console.log("storeArr.STORE", storeArr.STORE_ID)
                      if (storeArr.STORE_ID && storeArr.STORE_ID == this.onboardingStoreId) {
                        this.storeSelected(storeArr);
                      }
                    });
                  });
                });
              } else {
                this.updateSelection(this.firstStore);
              }
            }
          }


        }
        // else {
        //   console.log("else block")
        //   this.storeSelected(this.STORE);
        // }
      }

      if (this.showAllStore === true && this.onboardingStoreId != 0) {
        //console.log("inside the block")
        this.data.COUNTRIES.map((countryArr) => {
          countryArr.CITIES.map((cityArr) => {
            cityArr.STORE.map((storeArr, index) => {
              //console.log("storeArr.STORE", storeArr.STORE_ID)
              if (storeArr.STORE_ID && storeArr.STORE_ID == this.onboardingStoreId) {
                this.storeSelected(storeArr);
              }
            });
          });
        });
      }
      // else {
      //   console.log("values", this.showAllStore, this.onboardingStoreId, typeof this.STORE, this.CITY.CITY, this.firstStore)
      //   if (this.showAllStore === true && this.onboardingStoreId === 0 && typeof this.STORE == "undefined" && this.CITY.CITY && this.firstStore === false) {
      //     console.log("Here it is coming")
      //     this.citySelected(this.CITY)
      //   }
      // }

      //if sgp change city to type//
      this.json.getCompanyLocation().subscribe((json) => {
        const index = json.findIndex(
          (res) => res.companyName === this.app.user.companyName
        );
        if (index !== -1) {
          this.isCityToType = true;
          this.labels.city = "Type";
        }
      });
    }
    // this.updateSelection();
    // console.log('labels',this.labels)
    this.labels.city = "Location";
    this.labels.country = this.translate.instant("Country");
    this.labels.space = this.translate.instant("Space_Type");
    this.labels.stores = "Facility";
  }

  async buildDropdownList(dataList) {
    //console.log("country list", dataList)
    this.countryCount = dataList.length;
    this.entireCityList = [];
    this.entireStoreList = [];
    //console.log("store count 0", this.storeCount)
    dataList.map((countryArr) => {
      countryArr.CITIES.map((cityArr) => {
        this.entireCityList.push(cityArr);
        cityArr.STORE.map((storeArr, index) => {
          //console.log("storeArr.STORE", storeArr.STORE_ID)
          if (storeArr.STORE_NAME && storeArr.STORE_NAME.length > 0) {
            this.entireStoreList.push(storeArr);
          }
        });
      });
    });
    this.cityCount = this.entireCityList.length;
    this.storeCount = this.entireStoreList.length;
    //console.log("store count 1", this.storeCount)
  }

  /*async firstStoreSelect(firstStoreSelect) {
    let firstStore = this.entireStoreList[0];
    if (firstStoreSelect === true) {
      this.STORE = firstStore;
      this.updateSelection();
    } else {
      this.STORE = null;
    }
    this.STORE.checked = true;
  }*/

  /* Function: To search list of cities of a COUNTRY and to set defult city if present
   * @params "COUNTRY, setCity"
   * COUNTRY <object>: selected COUNTRY
   * setCity <boolean>: to handle default setter
   */
  async searchCity() {
    this.data.CITIES = this.COUNTRY.CITIES;
    //console.log("CITIES", this.data.CITIES);
  }

  /* Nav-Function: navigate back to list of locations view
   */
  backToLocations() {
    this.back.emit();
  }

  /* Function: To set and update COUNTRY selection
   * @params "COUNTRY"
   * COUNTRY <object>: selected COUNTRY
   */
  countrySelected(COUNTRY) {
    this.firstStore = false;
    this.COUNTRY = null;
    this.CITY = null;
    this.STORE = null;
    if (COUNTRY) {
      this.COUNTRY = COUNTRY;
      this.COUNTRY.checked = true;
      let selectedCountry = this.filterCountry([this.COUNTRY]);
      sessionStorage.setItem("THIS_COUNTRY_B", JSON.stringify(selectedCountry))
    } else {
      sessionStorage.removeItem("THIS_COUNTRY_B")
    }
    sessionStorage.removeItem("THIS_CITY_B")
    sessionStorage.removeItem("THIS_STORE_B")
    this.updateSelection(this.firstStore);
  }

  /* Function: To set and update space selection
   * @params "space"
   * space <object>: selected space
   */
  spaceSelected(space) {
    this.SPACE_TYPE = null;
    if (space) {
      this.SPACE_TYPE = space;
      this.SPACE_TYPE.checked = true;
    }
    this.updateSelection(false);
  }

  /* Function: To set and update city selection
   * @params "city"
   * city <object>: selected city
   */
  async citySelected(city) {
    this.firstStore = false;
    this.CITY = null;
    this.STORE = null;
    if (city) {
      this.CITY = city;
      this.CITY.checked = true;

      let selectedCity = this.filterCity([this.CITY]);
      sessionStorage.setItem("THIS_CITY_B", JSON.stringify(selectedCity))
    } else {
      sessionStorage.removeItem("THIS_CITY_B")
    }
    sessionStorage.removeItem("THIS_STORE_B")
    this.updateSelection(this.firstStore);
  }

  storeSelected(store) {
    //console.log("storeSelected")
    this.firstStore = false;
    this.STORE = null;
    if (store) {
      this.STORE = store;
      this.STORE.checked = true;

      let selectedStore = this.filterStore([this.STORE]);
      sessionStorage.setItem("THIS_STORE_B", JSON.stringify(selectedStore))
    } else {
      sessionStorage.removeItem("THIS_STORE_B")
    }
    //console.log("store in storeSelected", this.STORE)
    this.updateSelection(this.firstStore);
  }

  /* Function: To set and emit back selected list options
   */
  async updateSelection(firstStoreFlag) {
    //console.log("Call.........")
    if (!this.data) {
      this.data = {};
    }
    if (firstStoreFlag === true) {
      //console.log("Here.......")
      if (
        localStorage.getItem("newStoreID") !== undefined &&
        localStorage.getItem("newStoreID") !== null && localStorage.getItem("newStoreID") != '0'
      ) {
        if (this.entireStoreList.length == 0) {
          this.buildDropdownList(this.data.COUNTRIES);
        }
        this.STORE = this.entireStoreList.find(
          (m) => m.STORE_ID === Number(localStorage.getItem("newStoreID"))
        );
      } else {
        //console.log("1")
        this.STORE = this.entireStoreList[0];
      }
    }
    if (this.STORE || this.CITY) {
      //console.log("2")
      this.data.COUNTRIES.map((countryArr) => {
        countryArr.CITIES.map((cityArr) => {
          //console.log("City", this.CITY);         
          if (this.STORE) {
            //console.log("3")
            //console.log("country arr", countryArr)
            cityArr.STORE.map((storeArr, index) => {
              if (storeArr.STORE_NAME && storeArr.STORE_NAME == this.STORE.STORE_NAME) {
                //console.log("city array", cityArr);
                //console.log("4")
                this.CITY = cityArr;
                if (cityArr.CITY && cityArr.CITY == this.CITY.CITY) {
                  //console.log("5")
                  this.COUNTRY = countryArr;
                  this.entireStoreList = cityArr.STORE;
                  //console.log("cnt", 1)
                  this.entireCityList = this.COUNTRY.CITIES;
                }
              }
            });
          }
          //console.log("this.city", this.CITY)
          if (this.CITY) {
            //console.log("6")
            if (cityArr.CITY && cityArr.CITY == this.CITY.CITY) {
              //console.log("7")
              this.COUNTRY = countryArr;
              this.entireStoreList = cityArr.STORE;
              //console.log("cnt", 2)
            }
          } else {
            //console.log("8")
            this.entireStoreList = [];
            cityArr.STORE.map((storeArr, index) => {
              //console.log("storeArr.STORE", storeArr.STORE_ID)
              storeArr.checked = false;
              if (storeArr.STORE_NAME && storeArr.STORE_NAME.length > 0) {
                this.entireStoreList.push(storeArr);
              }
            });
          }
        });
      });
    } else {
      //console.log("countries", this.data.COUNTRIES)
      //console.log("country", this.COUNTRY)
      this.entireCityList = [];
      this.entireStoreList = [];
      if (this.COUNTRY) {
        this.COUNTRY.CITIES.map((cityArr) => {
          this.entireCityList.push(cityArr);
          cityArr.STORE.map((storeArr, index) => {
            //console.log("storeArr.STORE", storeArr.STORE_ID)
            if (storeArr.STORE_NAME && storeArr.STORE_NAME.length > 0) {
              this.entireStoreList.push(storeArr);
            }
          });
        });
        //console.log("Loc", this.entireCityList)
        //console.log("Fac", this.entireStoreList)
      } else {
        this.data.COUNTRIES.map((countryArr) => {
          countryArr.CITIES.map((cityArr) => {
            this.entireCityList.push(cityArr);
            cityArr.STORE.map((storeArr, index) => {
              //console.log("storeArr.STORE", storeArr.STORE_ID)
              if (storeArr.STORE_NAME && storeArr.STORE_NAME.length > 0) {
                this.entireStoreList.push(storeArr);
              }
            });
          });
        });
      }
    }
    this.cityCount = this.entireCityList.length;
    this.storeCount = this.entireStoreList.length;



    //console.log("entire store list", this.entireStoreList)
    //console.log("entire city list", this.entireCityList)
    //console.log("store count 2", this.storeCount)
    //console.log("City Obj", this.CITY)

    this.data.COUNTRY = this.COUNTRY ? [this.COUNTRY] : [];
    this.data.SPACE_TYPE = this.SPACE_TYPE;
    this.data.CITY = this.CITY ? [this.CITY] : [];
    this.data.CITIES = _.uniqBy(this.entireCityList, 'CITY');
    this.data.STORE = this.STORE ? [this.STORE] : [];
    this.data.STORES = _.uniqBy(this.entireStoreList, '_id');
    this.data.COUNTRIES = _.uniqBy(this.data.COUNTRIES, 'COUNTRY');
    this.app.basicDetails = this.data;
    this.dataChange.emit(this.data);

  }

  filterCountry(selectedCountry) {
    let countryList = JSON.parse(JSON.stringify(selectedCountry));
    let filteredCountryList = [];

    for (let i = 0; i < countryList.length; i++) {
      delete countryList[i].CITIES;

      delete countryList[i].CITY_COUNT;

      delete countryList[i].DEVICE_COUNT;

      delete countryList[i].APPLIANCES_COUNT;

      delete countryList[i].STORE_COUNT;

      delete countryList[i].CATEGORY_COUNT;

      filteredCountryList.push(countryList[i]);
    }

    return filteredCountryList;
  }

  filterCity(selectedCity) {
    let cityList = JSON.parse(JSON.stringify(selectedCity));
    let filteredCityList = [];

    for (let i = 0; i < cityList.length; i++) {
      delete cityList[i].STORE;

      delete cityList[i].STORE_COUNT;

      delete cityList[i].DEVICE_COUNT;

      delete cityList[i].APPLIANCES_COUNT;

      delete cityList[i].CATEGORY_COUNT;

      filteredCityList.push(cityList[i]);
    }

    return filteredCityList;
  }

  filterStore(selectedStore) {
    let storeList = JSON.parse(JSON.stringify(selectedStore));
    let filteredStoreList = [];

    for (let i = 0; i < storeList.length; i++) {
      delete storeList[i].TARGET;

      delete storeList[i].LATTITUDE;

      delete storeList[i].LONGITUDE;

      delete storeList[i].STORE_INCHARGE;

      delete storeList[i].TOTAL_FLOOR_AREA;

      delete storeList[i].DEVICE_DETAILS;

      delete storeList[i].AREA_IN;

      delete storeList[i].TIMEZONE;

      delete storeList[i].USERS;

      delete storeList[i].CLUSTER_NAME;

      delete storeList[i].CATEGORY_COUNT;

      delete storeList[i].DEVICE_COUNT;

      delete storeList[i].APPLIANCES_COUNT;

      delete storeList[i].COUNTRY;

      delete storeList[i].CITY;

      filteredStoreList.push(storeList[i]);
    }
    return filteredStoreList;
  }
}
