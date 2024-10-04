import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeconfigurationComponent } from './nodeconfiguration.component';

describe('NodeconfigurationComponent', () => {
  let component: NodeconfigurationComponent;
  let fixture: ComponentFixture<NodeconfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NodeconfigurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
