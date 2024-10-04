import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultIntlComponent } from './default-intl.component';

describe('DefaultIntlComponent', () => {
  let component: DefaultIntlComponent;
  let fixture: ComponentFixture<DefaultIntlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefaultIntlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultIntlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
