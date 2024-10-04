import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalfPieComponent } from './half-pie.component';

describe('HalfPieComponent', () => {
  let component: HalfPieComponent;
  let fixture: ComponentFixture<HalfPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HalfPieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HalfPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
