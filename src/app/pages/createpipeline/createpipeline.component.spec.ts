import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepipelineComponent } from './createpipeline.component';

describe('CreateprojectComponent', () => {
  let component: CreatepipelineComponent;
  let fixture: ComponentFixture<CreatepipelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatepipelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatepipelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
