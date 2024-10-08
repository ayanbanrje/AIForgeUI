import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildModuleExtensionComponent } from './child-module-extension.component';

describe('ChildModuleExtensionComponent', () => {
  let component: ChildModuleExtensionComponent;
  let fixture: ComponentFixture<ChildModuleExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChildModuleExtensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildModuleExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
