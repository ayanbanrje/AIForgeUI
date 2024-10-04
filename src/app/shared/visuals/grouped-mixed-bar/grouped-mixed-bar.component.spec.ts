import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedMixedBarComponent } from './grouped-mixed-bar.component';

describe('GroupedMixedBarComponent', () => {
  let component: GroupedMixedBarComponent;
  let fixture: ComponentFixture<GroupedMixedBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupedMixedBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedMixedBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
