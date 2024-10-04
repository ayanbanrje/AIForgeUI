import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLine2Component } from './multi-line2.component';

describe('MultiLine2Component', () => {
  let component: MultiLine2Component;
  let fixture: ComponentFixture<MultiLine2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiLine2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLine2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
