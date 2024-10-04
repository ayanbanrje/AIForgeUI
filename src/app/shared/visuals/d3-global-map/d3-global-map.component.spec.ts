import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3GlobalMapComponent } from './d3-global-map.component';

describe('D3GlobalMapComponent', () => {
  let component: D3GlobalMapComponent;
  let fixture: ComponentFixture<D3GlobalMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3GlobalMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GlobalMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
