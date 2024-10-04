import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanntChartComponent } from './gannt-chart.component';

describe('GanntChartComponent', () => {
  let component: GanntChartComponent;
  let fixture: ComponentFixture<GanntChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GanntChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GanntChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
