import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleExtensionComponent } from './module-extension.component';

describe('ModuleExtensionComponent', () => {
  let component: ModuleExtensionComponent;
  let fixture: ComponentFixture<ModuleExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuleExtensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
