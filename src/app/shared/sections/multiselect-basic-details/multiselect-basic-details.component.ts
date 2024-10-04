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
import { BasicDetailsService } from "src/app/services/basic-details.service";

@Component({
  selector: "app-multiselect-basic-details",

  templateUrl: "./multiselect-basic-details.component.html",

  styleUrls: ["./multiselect-basic-details.component.scss"],
})
export class MultiselectBasicDetailsComponent implements OnInit, OnChanges {
  spaces: Array<any> = Constants.space;

  SPACE_TYPE;

  STORE_NAME;

  cities: Array<any> = [];

  CITY: Array<any> = [];

  countries: Array<any> = [];

  COUNTRY: Array<any> = [];

  CLUSTER;

  stores: Array<any> = [
    {
      NAME: "BOSCH DEMO",
    },
  ];

  STORE: Array<any> = [];

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

    cluster: "Cluster",
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

  @Input() maxWidth = "350px";

  @Input() dropDownWidth = "100%";

  @Input() dropDownHeight = "2.5vw";

  @Input() ranDropdown = false;

  isCityToType: boolean = false;

  entireBasicDetailsList = [];

  entireCityList = [];

  entireStoreList = [];

  uniqueClusterList = [];

  countryCount = 0;

  cityCount = 0;

  storeCount = 0;

  clusterCount = 0;

  firstStore = true;

  callPreLoad = true;

  counter = 0;

  @Input() isAnalysis = false;
  @Input () categoryCount = 0;
  @Input() categoryDisabled = false;
  @Input() categoryLabel = "";
  @Input() categoryList = [];
  @Input() categoryKey = "";
  @Input() categoryView = "";
  @Input() categorySelected;
  @Input() showCategory = false;
  @Input() categoryDefaults;
  @Input() sendMultiSelectPreviousData = {};
  @Output() categoryChanged = new EventEmitter();
  @Output() categorySelectedChanged = new EventEmitter();
  @Output() sendMultiSelectData = new EventEmitter();
  @Output() dataChanged = new EventEmitter();
  @Input() oldAnalysis = false;
  @Input() dashboardRTM = false;

  constructor(
    private countriesService: CountriesService,

    public app: AppService,

    private json: JsonService,

    private customer: CustomersService,

    private translate: TranslateService,

    private appHelper: AppServiceHelper,
    private basicDetailsService: BasicDetailsService
  ) {
  }

  async ngOnInit() {

    await this.preLoad();

    if (this.counter > 0) {
      await this.load();
    }

    if(Object.keys(this.sendMultiSelectPreviousData).length > 0) {
      if(this.sendMultiSelectPreviousData["clusterSelected"] !== null) {
        this.CLUSTER = this.sendMultiSelectPreviousData["clusterSelected"];
      }
      if(this.sendMultiSelectPreviousData["countrySelected"].length > 0) {
        this.COUNTRY = this.sendMultiSelectPreviousData["countrySelected"];
      }
      if(this.sendMultiSelectPreviousData["locationSelected"].length > 0) {
        this.CITY = this.sendMultiSelectPreviousData["locationSelected"];
      }
      if(this.sendMultiSelectPreviousData["facilitySeleced"].length > 0) {
        this.STORE = this.sendMultiSelectPreviousData["facilitySeleced"];
      }
    }

    this.sendMultiSelectData.emit([this.CLUSTER, this.COUNTRY, this.CITY, this.STORE]);
  }

  async ngOnChanges() {
    if (this.counter > 0) {
      //await this.load();
    }
  }

  async preLoad() {

    if (this.data) {

      this.data.COUNTRIES.filter((countryArr, countryIndex) => {
        if (countryArr.COUNTRY == "undefined") {
          this.data.COUNTRIES.splice(countryIndex, 1);
        }
      });

      this.entireBasicDetailsList = JSON.parse(
        JSON.stringify(this.data.COUNTRIES)
      );


      if (this.entireBasicDetailsList.length > 0) {
      }

      this.buildDropdownList(this.entireBasicDetailsList);
    }
  }

  async load() {

    if (this.data) {
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


      if (
        this.firstStore === true &&
        this.STORE.length == 0 &&
        this.showAllStore === false
      ) {

        if (!this.onboardingStoreId || this.onboardingStoreId == 0) {
          this.updateSelection(this.firstStore);
        } else {
          this.updateSelection(this.firstStore);
        }
      } else {

        if (
          this.firstStore === true &&
          typeof this.STORE == "object" &&
          this.showAllStore === false &&
          this.reportNanalysis === true &&
          this.onboardingStoreId != 0
        ) {
          this.data.COUNTRIES.map((countryArr) => {
            countryArr.CITIES.map((cityArr) => {
              cityArr.STORE.map((storeArr, index) => {

                if (
                  storeArr.STORE_ID &&
                  storeArr.STORE_ID == this.onboardingStoreId
                ) {
                  this.data.COUNTRIES.map((countryArr) => {
                    countryArr.CITIES.map((cityArr) => {
                      cityArr.STORE.map((storeArr, index) => {

                        if (
                          storeArr.STORE_ID &&
                          storeArr.STORE_ID == this.onboardingStoreId
                        ) {
                          this.storeSelected(storeArr);
                        }
                      });
                    });
                  });
                }
              });
            });
          });
        } else {
          if (
            this.showAllStore === false &&
            this.reportNanalysis === true &&
            this.onboardingStoreId != 0
          ) {
            this.data.COUNTRIES.map((countryArr) => {
              countryArr.CITIES.map((cityArr) => {
                cityArr.STORE.map((storeArr, index) => {
                  if (
                    storeArr.STORE_ID &&
                    storeArr.STORE_ID == this.onboardingStoreId
                  ) {
                    this.storeSelected(storeArr);
                  }
                });
              });
            });
          } else {
            if (
              this.showAllStore === true &&
              this.onboardingStoreId === 0 &&
              (typeof this.STORE == "undefined" ||
                typeof this.STORE == "object") &&
              (!this.STORE || this.STORE == null) &&
              this.CITY &&
              this.CITY.length > 0
            ) {
              this.citySelected(this.CITY);
            } else {
              if (this.showAllStore === false && this.onboardingStoreId !== 0) {
                this.storeSelected(this.STORE);

                //this.updateSelection(this.firstStore);

                this.data.COUNTRIES.map((countryArr) => {
                  countryArr.CITIES.map((cityArr) => {
                    cityArr.STORE.map((storeArr, index) => {

                      if (
                        storeArr.STORE_ID &&
                        storeArr.STORE_ID == this.onboardingStoreId
                      ) {
                        //this.storeSelected(storeArr);
                      }
                    });
                  });
                });

                /*for (let i = 0; i < this.entireBasicDetailsList.length; i++) {

                                for (let j = 0; j < this.entireBasicDetailsList[i].CITIES.length; j++) {

                                  for (let s = 0; s < this.entireBasicDetailsList[i]['CITIES'][j].STORE.length; s++) {

              

                                  }

                                }

                              }*/
              } else {
                this.updateSelection(false);
              }
            }
          }
        }
      }
    }

    // this.updateSelection();


    this.labels.city = "Location";

    this.labels.country = this.translate.instant("Country");

    this.labels.space = this.translate.instant("Space_Type");

    this.labels.stores = "Facility";

    this.labels.cluster = "Cluster";
  }

  async buildDropdownList(dataList) {

    this.countryCount = dataList.length;

    this.entireCityList = [];

    this.entireStoreList = [];

    this.uniqueClusterList = [];

    let entireClusterList = [];


    dataList.map((countryArr) => {
      countryArr.CITIES.map((cityArr) => {
        this.entireCityList.push(cityArr);

        cityArr.STORE.map((storeArr, index) => {

          if (storeArr.STORE_NAME && storeArr.STORE_NAME.length > 0) {
            this.entireStoreList.push(storeArr);

            entireClusterList.push({ CLUSTER: storeArr.CLUSTER_NAME });
          }
        });
      });
    });

    this.cityCount = this.entireCityList.length;

    this.storeCount = this.entireStoreList.length;

    // pass a iteratee/predicate function that returns the first_name property

    this.uniqueClusterList = _.uniqBy(entireClusterList, "CLUSTER");


    this.clusterCount = this.uniqueClusterList.length;

    // output

    // => [ { id: 1, first_name: 'Thekla' }, { id: 2, first_name: 'Ugo' } ]


    this.counter = this.counter + 1;
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
    for (let i = 0; i < this.COUNTRY.length; i++) {
      this.data.CITIES = this.COUNTRY[i].CITIES;
    }

    //this.data.CITIES = this.COUNTRY.CITIES;

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
      if(COUNTRY.length == 0) {
        this.entireCityList = this.entireCityList.map((m)=>{
          m.checked = false;
          return m;
        });
  
        this.entireStoreList = this.entireStoreList.map((m)=>{
          m.checked = false;
          return m;
        });
  
        if(localStorage.getItem("_location") !== null) {
          localStorage.removeItem("_location");
        }
        if(localStorage.getItem("_store") !== null) {
          localStorage.removeItem("_store");
        }
      }
      if(localStorage.getItem("_location") !== null) {
        localStorage.removeItem("_location");
      }
      if(localStorage.getItem("_store") !== null) {
        localStorage.removeItem("_store");
      }
    this.firstStore = false;

    this.COUNTRY = [];

    this.CITY = [];

    this.STORE = [];

    if (COUNTRY.length > 0) {
      this.COUNTRY = COUNTRY;

      let selectedCountry = this.filterCountry(this.COUNTRY);

      sessionStorage.setItem("THIS_COUNTRY", JSON.stringify(selectedCountry));
    } else {
      sessionStorage.removeItem("THIS_COUNTRY");
    }

    sessionStorage.removeItem("THIS_CITY");

    sessionStorage.removeItem("THIS_STORE");

    this.updateSelection(this.firstStore);
    this.sendMultiSelectData.emit([this.CLUSTER, this.COUNTRY, this.CITY, this.STORE]);
  }

  clusterSelected(CLUSTER) {
    if(CLUSTER) {} else {
      this.data.COUNTRIES = this.data.COUNTRIES.map((m)=>{
        m.checked = false;
        return m;
      });

      this.entireCityList = this.entireCityList.map((m)=>{
        m.checked = false;
        return m;
      });

      this.entireStoreList = this.entireStoreList.map((m)=>{
        m.checked = false;
        return m;
      });

      if(localStorage.getItem("_country") !== null) {
        localStorage.removeItem("_country");
      }
      if(localStorage.getItem("_location") !== null) {
        localStorage.removeItem("_location");
      }
      if(localStorage.getItem("_store") !== null) {
        localStorage.removeItem("_store");
      }
    }
    this.firstStore = false;

    this.CLUSTER = null;

    this.COUNTRY = [];

    this.CITY = [];

    this.STORE = [];

    if (CLUSTER) {
      this.CLUSTER = CLUSTER;

      this.CLUSTER.checked = true;

      sessionStorage.setItem("THIS_CLUSTER", JSON.stringify(this.CLUSTER));
    } else {
      sessionStorage.removeItem("THIS_CLUSTER");
    }

    sessionStorage.removeItem("THIS_COUNTRY");

    sessionStorage.removeItem("THIS_CITY");

    sessionStorage.removeItem("THIS_STORE");

    this.updateSelection(this.firstStore);
    this.sendMultiSelectData.emit([this.CLUSTER, this.COUNTRY, this.CITY, this.STORE]);
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
    if(city.length == 0) {
      this.entireStoreList = this.entireStoreList.map((m)=>{
        m.checked = false;
        return m;
      });

      if(localStorage.getItem("_store") !== null) {
        localStorage.removeItem("_store");
      }
    }
    if(localStorage.getItem("_store") !== null) {
      localStorage.removeItem("_store");
    }
    this.firstStore = false;

    this.CITY = [];

    this.STORE = [];

    if (city) {
      this.CITY = city;

      let selectedCity = this.filterCity(this.CITY);

      sessionStorage.setItem("THIS_CITY", JSON.stringify(selectedCity));
    } else {
      sessionStorage.removeItem("THIS_CITY");
    }

    sessionStorage.removeItem("THIS_STORE");

    this.updateSelection(this.firstStore);
    this.sendMultiSelectData.emit([this.CLUSTER, this.COUNTRY, this.CITY, this.STORE]);
  }

  storeSelected(store) {

    this.firstStore = false;

    this.STORE = [];

    if (store) {
      this.STORE = store;

      let selectedStore = this.filterStore(this.STORE);

      sessionStorage.setItem("THIS_STORE", JSON.stringify(selectedStore));
    } else {
      sessionStorage.removeItem("THIS_STORE");
    }


    this.updateSelection(this.firstStore);
    this.sendMultiSelectData.emit([this.CLUSTER, this.COUNTRY, this.CITY, this.STORE]);
  }

  /* Function: To set and emit back selected list options

   */

  async updateSelection(firstStoreFlag) {
    let selectedSessionStore = sessionStorage.getItem("THIS_STORE");

    if (this.entireStoreList.length == 0) {
      this.buildDropdownList(this.entireBasicDetailsList);
    }
    if (selectedSessionStore) {
      let builtSelectedStoreFromSession = this.buildSelectedStore(selectedSessionStore);

      this.STORE = builtSelectedStoreFromSession;
    }

    let selectedSessionCluster = sessionStorage.getItem("THIS_CLUSTER");

    if (selectedSessionCluster) {
      this.CLUSTER = JSON.parse(selectedSessionCluster);
    }

    let selectedSessionCountry = sessionStorage.getItem("THIS_COUNTRY");

    if (selectedSessionCountry) {
      let builtSelectedCountryFromSession = this.buildSelectedCountry(selectedSessionCountry);

      this.COUNTRY = builtSelectedCountryFromSession;

      for (let i = 0; i < this.COUNTRY.length; i++) {
        if (this.COUNTRY[i].hasOwnProperty("key") === false) {
          this.COUNTRY[i].key = this.COUNTRY[i].COUNTRY;
        }

        if (this.COUNTRY[i].hasOwnProperty("view") === false) {
          this.COUNTRY[i].view = this.COUNTRY[i].COUNTRY;
        }

        if (this.COUNTRY[i].hasOwnProperty("_idx") === false) {
          this.COUNTRY[i]._idx = "dropdown_option" + i;
        }
      }

      let selectedCountry = this.filterCountry(this.COUNTRY);

      sessionStorage.setItem("THIS_COUNTRY", JSON.stringify(selectedCountry));
    }

    let selectedSessionCity = sessionStorage.getItem("THIS_CITY");

    if (selectedSessionCity) {
      let builtSelectedCityFromSession = this.buildSelectedCity(selectedSessionCity);
      this.CITY = builtSelectedCityFromSession;
    }

    //this.STORE = sessionStorage.getItem("THIS_STORE")

    if (!this.data) {
      this.data = {};
    }

    if (firstStoreFlag === true) {
      if (this.entireStoreList.length == 0) {
        this.buildDropdownList(this.entireBasicDetailsList);
      }

      if (this.STORE && this.STORE.length > 0) {
        this.STORE = this.STORE;
      } else {
        this.STORE.push(this.entireStoreList[0]);
      }
    }

    let entireCountryList = [];

    let entireCityList = [];

    let entireStoreList = [];

    let selectedCityList = [];

    if (this.STORE.length > 0) {
      if (
        this.STORE.length == 1 &&
        this.CITY.length <= 1 &&
        this.COUNTRY.length <= 1
      ) {
        this.CLUSTER = this.uniqueClusterList.find(
          (cl) => cl.CLUSTER === this.STORE[0].CLUSTER_NAME
        );

        this.CLUSTER.checked = true;
      } else if (
        this.STORE.length > 1 &&
        this.CITY.length <= 1 &&
        this.COUNTRY.length <= 1
      ) {
        let clusterArr = [];

        for (let i = 0; i < this.STORE.length; i++) {
          clusterArr.push(this.STORE[i].CLUSTER_NAME);
        }

        clusterArr = _.uniq(clusterArr);

        if (clusterArr.length == 1) {
          this.CLUSTER = this.uniqueClusterList.find(
            (cl) => cl.CLUSTER === clusterArr[0]
          );

          this.CLUSTER.checked = true;
        } else {
          this.CLUSTER.checked = false;

          this.CLUSTER = null;
        }
      } else if (this.STORE.length > 0 && this.CLUSTER) {
        let clusterArr = [];

        for (let i = 0; i < this.STORE.length; i++) {
          clusterArr.push(this.STORE[i].CLUSTER_NAME);
        }

        clusterArr = _.uniq(clusterArr);

        if (clusterArr.length == 1) {
          this.CLUSTER = this.uniqueClusterList.find(
            (cl) => cl.CLUSTER === clusterArr[0]
          );

          this.CLUSTER.checked = true;
        } else {
          this.CLUSTER.checked = false;

          this.CLUSTER = null;
        }
      } else {
        if (this.CLUSTER) {
          this.CLUSTER.checked = false;

          this.CLUSTER = null;
        }
      }
    }

    if (
      typeof this.CLUSTER !== "undefined" &&
      typeof this.CLUSTER === "object" &&
      this.CLUSTER !== null
    ) {
      for (let i = 0; i < this.entireBasicDetailsList.length; i++) {
        for (let j = 0; j < this.entireBasicDetailsList[i].CITIES.length; j++) {
          for (
            let s = 0;
            s < this.entireBasicDetailsList[i]["CITIES"][j].STORE.length;
            s++
          ) {
            if (
              this.entireBasicDetailsList[i]["CITIES"][j]["STORE"][s][
              "CLUSTER_NAME"
              ] == this.CLUSTER.CLUSTER
            ) {
              entireStoreList.push(
                this.entireBasicDetailsList[i]["CITIES"][j]["STORE"][s]
              );

              this.entireStoreList = entireStoreList;

              entireCityList.push(this.entireBasicDetailsList[i]["CITIES"][j]);

              this.entireCityList = entireCityList;

              entireCountryList.push(this.entireBasicDetailsList[i]);

              this.data.COUNTRIES = entireCountryList;

              this.data = Object.assign({}, this.data);
            }
          }
        }
      }
    } else {
      let sessionBasicDetails = sessionStorage.getItem("THIS_BASIC_DETAILS");

      if (sessionBasicDetails) {
        this.entireBasicDetailsList = JSON.parse(sessionBasicDetails).COUNTRIES;
      }

      for (let i = 0; i < this.entireBasicDetailsList.length; i++) {
        entireCountryList.push(this.entireBasicDetailsList[i]);

        this.data.COUNTRIES = entireCountryList;

        this.data = Object.assign({}, this.data);

        for (let j = 0; j < this.entireBasicDetailsList[i].CITIES.length; j++) {
          entireCityList.push(this.entireBasicDetailsList[i]["CITIES"][j]);

          this.entireCityList = entireCityList;

          for (
            let s = 0;
            s < this.entireBasicDetailsList[i]["CITIES"][j].STORE.length;
            s++
          ) {
            entireStoreList.push(
              this.entireBasicDetailsList[i]["CITIES"][j]["STORE"][s]
            );

            this.entireStoreList = entireStoreList;
          }
        }
      }
    }

    entireCountryList = _.uniqBy(entireCountryList, "COUNTRY");

    entireCityList = _.uniqBy(entireCityList, "CITY");

    entireStoreList = _.uniqBy(entireStoreList, "_id");

    this.data.COUNTRIES = _.uniqBy(this.data.COUNTRIES, "COUNTRY");

    this.entireCityList = _.uniqBy(this.entireCityList, "CITY");

    this.entireStoreList = _.uniqBy(this.entireStoreList, "_id");

    if (this.STORE.length > 0) {

      for (let k = 0; k < this.STORE.length; k++) {
        for (let m = 0; m < entireCityList.length; m++) {
          if (entireCityList[m].STORE.find((s) => s._id == this.STORE[k]._id)) {
            this.CITY.push(entireCityList[m]);
          }
        }
      }

      this.CITY = _.uniqBy(this.CITY, "CITY");

      if (this.CITY.length > 0) {
        for (let n = 0; n < this.CITY.length; n++) {
          for (let o = 0; o < entireCountryList.length; o++) {
            if (
              entireCountryList[o].CITIES.find(
                (c) => c.CITY == this.CITY[n].CITY
              )
            ) {
              this.COUNTRY.push(entireCountryList[o]);
            }
          }
        }
      }

      this.COUNTRY = _.uniqBy(this.COUNTRY, "COUNTRY");

      if (this.COUNTRY.length > 0) {
        this.entireCityList = [];

        this.entireStoreList = [];

        for (let i = 0; i < this.COUNTRY.length; i++) {
          this.COUNTRY[i].CITIES.map((cityArr) => {
            cityArr.STORE.map((storeArr, index) => {
              if (storeArr.STORE_NAME && storeArr.STORE_NAME.length > 0) {
                if (
                  typeof this.CLUSTER !== "undefined" &&
                  typeof this.CLUSTER === "object" &&
                  this.CLUSTER !== null
                ) {
                  if (storeArr.CLUSTER_NAME == this.CLUSTER.CLUSTER) {
                    this.entireCityList.push(cityArr);

                    if (this.CITY.find((c) => c.CITY === cityArr.CITY)) {
                      this.entireStoreList.push(storeArr);
                    }
                  }
                } else {
                  if (this.CITY.find((c) => c.CITY === cityArr.CITY)) {
                    this.entireStoreList.push(storeArr);
                  }

                  this.entireCityList.push(cityArr);
                }
              }
            });
          });
        }
      }

      this.entireCityList = _.uniqBy(this.entireCityList, "CITY");

      this.entireStoreList = _.uniqBy(this.entireStoreList, "_id");

      this.COUNTRY = _.uniqBy(this.COUNTRY, "COUNTRY");

      this.CITY = _.uniqBy(this.CITY, "CITY");

      this.STORE = _.uniqBy(this.STORE, "_id");
    } else if (this.CITY.length > 0) {

      this.STORE = [];

      this.entireStoreList = [];

      for (let n = 0; n < this.CITY.length; n++) {
        for (let o = 0; o < entireCountryList.length; o++) {
          if (
            entireCountryList[o].CITIES.find((c) => c.CITY == this.CITY[n].CITY)
          ) {
            this.COUNTRY.push(entireCountryList[o]);
          }
        }
      }

      this.COUNTRY = _.uniqBy(this.COUNTRY, "COUNTRY");

      if (this.COUNTRY.length > 0) {
        this.entireCityList = [];

        this.entireStoreList = [];

        for (let i = 0; i < this.COUNTRY.length; i++) {
          this.COUNTRY[i].CITIES.map((cityArr) => {
            cityArr.STORE.map((storeArr, index) => {
              if (storeArr.STORE_NAME && storeArr.STORE_NAME.length > 0) {
                if (
                  typeof this.CLUSTER !== "undefined" &&
                  typeof this.CLUSTER === "object" &&
                  this.CLUSTER !== null
                ) {
                  if (storeArr.CLUSTER_NAME == this.CLUSTER.CLUSTER) {
                    this.entireCityList.push(cityArr);

                    if (this.CITY.find((c) => c.CITY === cityArr.CITY)) {
                      this.entireStoreList.push(storeArr);
                    }
                  }
                } else {
                  if (this.CITY.find((c) => c.CITY === cityArr.CITY)) {
                    this.entireStoreList.push(storeArr);
                  }

                  this.entireCityList.push(cityArr);
                }
              }
            });
          });
        }
      }

      this.entireStoreList = this.entireStoreList.map((s) => {
        s["checked"] = false;

        return s;
      });

      this.entireCityList = _.uniqBy(this.entireCityList, "CITY");

      this.entireStoreList = _.uniqBy(this.entireStoreList, "_id");

      this.COUNTRY = _.uniqBy(this.COUNTRY, "COUNTRY");

      this.CITY = _.uniqBy(this.CITY, "CITY");
    } else if (this.COUNTRY.length > 0) {

      this.CITY = [];

      this.STORE = [];

      this.entireCityList = [];

      this.entireStoreList = [];

      for (let i = 0; i < this.COUNTRY.length; i++) {
        this.COUNTRY[i].CITIES.map((cityArr) => {
          cityArr.STORE.map((storeArr, index) => {
            if (storeArr.STORE_NAME && storeArr.STORE_NAME.length > 0) {
              if (
                typeof this.CLUSTER !== "undefined" &&
                typeof this.CLUSTER === "object" &&
                this.CLUSTER !== null
              ) {
                if (storeArr.CLUSTER_NAME == this.CLUSTER.CLUSTER) {
                  this.entireStoreList.push(storeArr);

                  this.entireCityList.push(cityArr);
                }
              } else {
                this.entireStoreList.push(storeArr);

                this.entireCityList.push(cityArr);
              }
            }
          });
        });
      }

      this.entireCityList = this.entireCityList.map((c) => {
        c["checked"] = false;

        return c;
      });

      this.entireStoreList = this.entireStoreList.map((s) => {
        s["checked"] = false;

        return s;
      });

      this.entireCityList = _.uniqBy(this.entireCityList, "CITY");

      this.entireStoreList = _.uniqBy(this.entireStoreList, "_id");
    } else {

      this.data.COUNTRIES = this.data.COUNTRIES.map((c) => {
        c["checked"] = false;

        return c;
      });

      this.entireCityList = this.entireCityList.map((c) => {
        c["checked"] = false;

        return c;
      });

      this.entireStoreList = this.entireStoreList.map((s) => {
        s["checked"] = false;

        return s;
      });

      this.entireCityList = _.uniqBy(this.entireCityList, "CITY");

      this.entireStoreList = _.uniqBy(this.entireStoreList, "_id");

      entireCountryList = _.uniqBy(entireCountryList, "COUNTRY");

      this.data.COUNTRIES = entireCountryList;

      this.countryCount = this.data.COUNTRIES.length;

      entireCityList = _.uniqBy(entireCityList, "CITY");

      this.entireCityList = entireCityList;

      entireStoreList = _.uniqBy(entireStoreList, "_id");

      this.entireStoreList = entireStoreList;

      this.data = Object.assign({}, this.data);
    }

    this.cityCount = this.entireCityList.length;

    this.storeCount = this.entireStoreList.length;

    if (this.CLUSTER) {
      sessionStorage.setItem("THIS_CLUSTER", JSON.stringify(this.CLUSTER));
    }

    if (this.COUNTRY.length > 0) {
      let selectedCountry = this.filterCountry(this.COUNTRY);

      sessionStorage.setItem("THIS_COUNTRY", JSON.stringify(selectedCountry));
    }

    if (this.CITY.length > 0) {
      let selectedCity = this.filterCity(this.CITY);

      sessionStorage.setItem("THIS_CITY", JSON.stringify(selectedCity));
    }

    if (this.STORE.length > 0) {
      let selectedStore = this.filterStore(this.STORE);

      sessionStorage.setItem("THIS_STORE", JSON.stringify(selectedStore));
    }

    this.data.COUNTRIES = this.data.COUNTRIES.map((c) => {
      c["checked"] = false;

      return c;
    });

    this.entireCityList = this.entireCityList.map((c) => {
      c["checked"] = false;

      return c;
    });

    this.entireStoreList = this.entireStoreList.map((s) => {
      s["checked"] = false;

      return s;
    });


    for (let i = 0; i < this.STORE.length; i++) {
      if (this.entireStoreList.find((s) => s["_id"] === this.STORE[i]["_id"])) {
        this.entireStoreList.find((s) => s["_id"] === this.STORE[i]["_id"])[
          "checked"
        ] = true;
      }
    }

    for (let i = 0; i < this.CITY.length; i++) {
      if (this.entireCityList.find((c) => c["CITY"] === this.CITY[i]["CITY"])) {
        this.entireCityList.find((c) => c["CITY"] === this.CITY[i]["CITY"])[
          "checked"
        ] = true;
      }
    }
    for (let i = 0; i < this.COUNTRY.length; i++) {
      if (
        this.data.COUNTRIES.find(
          (c) => c["COUNTRY"] === this.COUNTRY[i]["COUNTRY"]
        )
      ) {
        this.data.COUNTRIES.find(
          (c) => c["COUNTRY"] === this.COUNTRY[i]["COUNTRY"]
        )["checked"] = true;
      }
    }

    this.data.COUNTRY = this.COUNTRY;

    this.data.SPACE_TYPE = this.SPACE_TYPE;

    this.data.CITY = this.CITY;

    this.data.STORE = this.STORE;

    this.data.STORES = this.entireStoreList;

    this.data.CITIES = this.entireCityList;

    this.app.basicDetails = this.data;

    this.basicDetailsService.setBaicDetails(this.data);

    //localStorage.setItem('BASIC-DETAILS', JSON.stringify(this.data))

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

  buildSelectedStore(selectedSessionStore) {
    let selectedStoreArr = JSON.parse(selectedSessionStore);

    let selectedStoreEntireArr = [];
    for (let i = 0; i < selectedStoreArr.length; i++) {
      selectedStoreEntireArr.push(
        this.entireStoreList.find((s) => s._id == selectedStoreArr[i]._id)
      );
    }

    return selectedStoreEntireArr;
  }

  buildSelectedCountry(selectedSessionCountry) {
    let selectedCountryArr = JSON.parse(selectedSessionCountry);

    let selectedCountryEntireArr = [];

    for (let i = 0; i < selectedCountryArr.length; i++) {
      selectedCountryEntireArr.push(
        this.data.COUNTRIES.find(
          (c) => c.COUNTRY == selectedCountryArr[i].COUNTRY
        )
      );
    }

    return selectedCountryEntireArr;
  }

  buildSelectedCity(selectedSessionCity) {
    let selectedCityArr = JSON.parse(selectedSessionCity);

    let selectedCityEntireArr = [];

    for (let i = 0; i < selectedCityArr.length; i++) {
      selectedCityEntireArr.push(
        this.entireCityList.find((c) => c.CITY == selectedCityArr[i].CITY)
      );
    }
    selectedCityEntireArr = _.uniqBy(selectedCityEntireArr, 'CITY');
    return selectedCityEntireArr;
  }
}
