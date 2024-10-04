import { Component, OnInit, Output, Input, EventEmitter, DoCheck } from "@angular/core";
import { ScriptsService } from "src/app/services/scripts.service";
import { LoadingService } from "src/app/services/loading.service";
import $ from "jquery";
declare let google: any;

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit,DoCheck {
  map;
  @Input() pincode;
  @Input() lat;
  @Input() lng;
  @Input() address;
  @Output() addressChange = new EventEmitter();
  @Output() pincodeChange = new EventEmitter();
  @Output() latChange = new EventEmitter();
  @Output() lngChange = new EventEmitter();
  countryData;
  marker;
  constructor(
    private scripts: ScriptsService,
    private loading: LoadingService
  ) {}

  ngDoCheck() {
    if($("body").find(".pac-container")) {
      if(Number($("body").find(".pac-container").css("z-index")) > 0) {
        $("body").find(".pac-container").css("z-index", "9999");
      }
    } 
  }

  ngOnInit() {
    const self = this;
    let lat;
    let lng;
    let pos;
    let myLatlng;
    self.scripts
      .load("map")
      .then(async () => {
        if (!this.lat && !this.lng) {
          // self.loading.show();
          // pos = await self.getLocation();
          // self.loading.hide();
        } else {
          pos = [this.lat, this.lng];
        }
        if (pos && pos[0] && pos[1]) {
          lat = pos[0];
          lng = pos[1];
          myLatlng = new google.maps.LatLng(pos[0], pos[1]);
        }
        self.loading.hide();
        const myOptions: any = {
          center: new google.maps.LatLng(0, 0),
          zoom: 5,
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        };
        if (myLatlng) {
          myOptions.center = myLatlng;
          myOptions.zoom = 13;
        }
        self.map = new google.maps.Map(
          document.getElementById("map"),
          myOptions
        );
        if (this.lat && this.lng) {
          self.marker = new google.maps.Marker({
            position: myLatlng,
            map: self.map,
          });
          self.marker.setMap(self.map);
        }
        const input = document.getElementById("searchAddress");
        const searchBox = new google.maps.places.SearchBox(input);
        self.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
        self.map.addListener("bounds_changed", () => {
          searchBox.setBounds(self.map.getBounds());
        });
        searchBox.addListener("places_changed", () => {
          const places = searchBox.getPlaces();
          if (places.length === 0) {
            return;
          }
          const boundGeomentry = new google.maps.LatLngBounds();
          let selectedLat = 0;
          let selectedLng = 0;
          places.forEach((place) => {
            if (!place.geometry) {
              return;
            }
            if (place.geometry.viewport) {
              boundGeomentry.union(place.geometry.viewport);
            } else {
              boundGeomentry.extend(place.geometry.location);
            }
            selectedLat =  place.geometry.location.lat();
            selectedLng = place.geometry.location.lng();
          });

          if(self.marker) {
            self.marker.setMap(null);
          }
          self.marker = new google.maps.Marker({
            position: {
              lat: selectedLat,
              lng: selectedLng,
            },
            map: self.map,
          });
          
          self.map.fitBounds(boundGeomentry);
        });

        const geocoder = new google.maps.Geocoder();
        google.maps.event.addListener(self.map, "click", (event) => {
          self.loading.show();
          const latLng = event.latLng;
          geocoder.geocode({ latLng }, async (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0]) {
                self.pincode = await self.getPincode(
                  results[0].address_components
                );
                self.pincodeChange.emit(self.pincode);
                self.lat = latLng.lat();
                self.lng = latLng.lng();

                await self.scripts
                  .getCountryDetail(self.lat, self.lng)
                  .then((data) => {
                    this.countryData = data["results"];
                  });
                self.latChange.emit(self.lat);
                self.lngChange.emit(self.lng);

                let country = "";
                let city = "";
                this.countryData[0]["address_components"].find((item) => {
                  for (let key in item) {
                    if (item[key][0] === "country") {
                      country = item.long_name;
                    }
                    if (item[key][0] === "locality") {
                      city = item.long_name;
                    }
                  }
                });

                this.countryData[0]["address_components"][
                  this.countryData[0]["address_components"].length - 1
                ].long_name;

                self.addressChange.emit([
                  this.countryData[0].formatted_address,
                  self.pincode,
                  country,
                  city,
                  self.lat,
                  self.lng,
                ]);
                self.loading.hide();
              }
            }
          });
        });
      })
      .catch((error) => {
        //console.log(error)
      });
  }

  async getLocation() {
    const self = this;
    if (navigator.geolocation) {
      self.loading.show();
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            resolve([lat, lng]);
          },
          (err) => {
            self.loading.hide();
            self.loading.showError(err);
            //resolve();
          },
          { maximumAge: 60000, timeout: 10000, enableHighAccuracy: true }
        );
      }).then((data) => {
        self.loading.hide();
        return data;
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  getPincode(address) {
    for (let p = address.length - 1; p >= 0; p--) {
      if (address[p].types.indexOf("postal_code") !== -1) {
        return address[p].long_name;
      }
    }
  }
}
