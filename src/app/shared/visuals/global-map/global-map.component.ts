/**
 * @ Author: Ajay Sharma
 * @ Create Time: 2020
 * @ Modified by: Your name
 * @ Modified time: 2020
 * @ Description: Google map api
 */
import {
  Component,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  DoCheck,
} from "@angular/core";
import { ScriptsService } from "src/app/services/scripts.service";
// import MarkerClusterer from '@google/markerclusterer';
// import { typeWithParameters } from '@angular/compiler/src/render3/util';
// import { LoadingService } from 'src/app/services/loading.service';
import $ from "jquery";
declare let google: any;
declare let MarkerClusterer: any;
declare let window: any;
@Component({
  selector: "app-global-map",
  templateUrl: "./global-map.component.html",
  styleUrls: ["./global-map.component.scss"],
})
export class GlobalMapComponent implements OnInit, OnChanges, DoCheck {
  // @ViewChild('glbmp', { static: false }) gl: ElementRef;
  map;
  // mapOptions = {
  //   disableDefaultUI: true
  // };
  city;
  @Input() LON;
  @Input() LAT;
  @Input() ZOOMED;
  @Input() locNAME;
  @Input() locCITY;
  @Input() storelist;
  @Output() navTo = new EventEmitter();
  isFound;
  script;
  markers;
  marker;
  dynamicScripts;
  node;
  markerCluster;
  // cityCircle;
  bounds;
  place;
  isBlur = false;
  constructor(private scripts: ScriptsService) { }

  ngDoCheck() {
    if ($("body").find(".gmnoprint")) {
      if (window.innerWidth < 769) {
        $("body").find(".gmnoprint").css("display", "none");
      } else {
        // $("body").find(".gmnoprint div").css("width", "auto");
        // $("body").find(".gmnoprint div").css("height", "auto");
      }
    }
    // console.log("ZOOM", this.map.getZoom());
    if(!this.markerCluster) {
      this.isBlur = true;
    } else {
      this.isBlur = false;
    }
  }

  ngOnInit() {
    this.load();
  }
  ngOnChanges() {
    this.load();
  }

  load() {
    const self = this;
    self.scripts.load("map").then(async () => {
      window.setTimeout(() => self.initMap(), 2000);
      self.scripts.load("mapcluster").then(() => {
        window.setTimeout(() => {
          self.markerCluster = new MarkerClusterer(self.map, self.markers, {
            imagePath:
              "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
          });
        }, 2000);
      });
    });
  }
  initMap() {
    const self = this;
    if(document.getElementById("globalmap")) {
      self.map = new google.maps.Map(document.getElementById("globalmap"), {
        center: { lat: 0, lng: 0 },
        zoom: 0.25,
        // mapTypeId: 'satellite',
        disableDefaultUI: true,
        zoomControl: true,
        // fullscreenControl: true
      });
    }
    if (self.locCITY === undefined) {
      self.place = self.locNAME;
    } else {
      self.place = self.locCITY;
    }
    const mapbounds = new google.maps.LatLngBounds();
    // for stores (lat and long available) set the map bounds
    // call geocoder to get boundary of country and city
    if (self.LAT && self.LON) {
      // mapbounds.extend({
      //   lat: self.LAT,
      //   lng: self.LON
      // });
      // self.map.fitBounds(mapbounds);

      let centerList = [];
      if (self.LAT.length === 1) {
        if(document.getElementById("globalmap")) {
          self.map = new google.maps.Map(document.getElementById("globalmap"), {
            center: { lat: self.LAT[0], lng: self.LON[0] },
            zoom: 15,
            // mapTypeId: 'satellite',
            disableDefaultUI: true,
            zoomControl: true,
            // fullscreenControl: true
          });
        }
      } else {
        self.LAT.map((m, i) => {
          centerList.push({ lat: self.LAT[i], lng: self.LON[i] });
        });
        centerList.forEach((center) => {
          mapbounds.extend(new google.maps.LatLng(center.lat, center.lng));
        });
        self.map.fitBounds(mapbounds);
      }
    } else if (self.place) {
      self.place.map((m) => {
        self.scripts.geoCoder(m).then((data) => {
          if (data.results.length > 0) {
            self.bounds = data.results[0].geometry.bounds;
            if (self.bounds) {
              mapbounds.extend(self.bounds.northeast);
              mapbounds.extend(self.bounds.southwest);
              self.map.fitBounds(mapbounds);
            }
          }
        });
      });
    } else {
      if(document.getElementById("globalmap")) {
        self.map = new google.maps.Map(document.getElementById("globalmap"), {
          center: { lat: 0, lng: 0 },
          zoom: 1,
          // mapTypeId: 'satellite',
          disableDefaultUI: true,
          zoomControl: true,
          // fullscreenControl: true
        });
      }
    }
    self.markers = self.storelist.map((location) => {
      return new google.maps.Marker({
        position: location,
      });
    });
    let lastInfoWindow;
    let selection;
    self.markers.forEach((marker, i) => {
      marker.addListener("click", () => {
        window.emit = (e) => {
          if (selection !== i) {
            self.navTo.emit(self.storelist[i]);
            selection = i;
          }
        };
        const infowindow = new google.maps.InfoWindow({
          content: `<div class="address-box">
              <div>${self.storelist[i].store}</div>
              <div>${self.storelist[i].city}</div>
            </div>`, // <i class="boschicon-bosch-ic-forward-right-double" onclick="javascript: window.emit()"></i>
        });
        if (lastInfoWindow) {
          lastInfoWindow.close();
        }
        infowindow.open(self.map, marker);
        lastInfoWindow = infowindow;
      });
    });
    // self.marker = new google.maps.Marker({
    //   position: { lat: -36.817685, lng: 175.699196 },
    //   map: self.map,
    //   title: 'Hello World!'
    // });
  }
}
