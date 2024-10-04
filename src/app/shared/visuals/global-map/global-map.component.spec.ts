import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalMapComponent } from './global-map.component';
import { ScriptsService } from 'src/app/services/scripts.service';
declare let google: any;
declare let MarkerClusterer: any;

describe('GlobalMapComponent', () => {
  let component: GlobalMapComponent;
  let fixture: ComponentFixture<GlobalMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalMapComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.load();
  });

  it('google map Component initialized', () => {
    expect(component).toBeTruthy();
  });

  // const fakeMap = () => {
  //   let map;
  //   // create fake DOM element for map
  //   const globalmap = document.createElement('div');
  //   globalmap.setAttribute('id', 'map-canvas');
  //   // map instance
  //   map = new google.maps.Map(globalmap);
  //   return map;
  // };

  // it('should test my google function', () => {
  //   // const map = fakeMap();
  //   const foo = component.initMap();
  //   expect(foo).toBe(true);
  // });

  // it('should test my function', () => {
  //   //   var map = fakeMap();
  //   //   google.maps.event.addListener(map, 'projection_changed', function() {
  //   //     foo = myfunction(map);
  //   //     expect(foo).toBe(true);
  //   //   });
  //   // });
  // });
});
