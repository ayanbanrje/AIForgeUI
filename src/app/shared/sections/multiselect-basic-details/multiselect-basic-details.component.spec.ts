import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiselectBasicDetailsComponent } from './multiselect-basic-details.component';

describe('MultiselectBasicDetailsComponent', () => {
  let component: MultiselectBasicDetailsComponent;
  let fixture: ComponentFixture<MultiselectBasicDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiselectBasicDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
