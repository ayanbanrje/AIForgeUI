import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as d3 from 'd3';
import { HorizontalStackBarComponent } from './horizontal-stack-bar.component';


fdescribe('HorizontalStackBarComponent', () => {
  let component: HorizontalStackBarComponent;
  let fixture: ComponentFixture<HorizontalStackBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HorizontalStackBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HorizontalStackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.definitions();
  });

  it('Horizontal stack bar graph Component initialized', () => {
    expect(component).toBeTruthy();
  });

  it('Horizontal component: SVG Rendered', () => {
    expect(getSvg()).not.toBeNull();
  });

  it('Validating svg width', () => {
    component.data = [{NAME: 'bnagalore', ENERGY: 100}, {NAME: 'bnagalore1', ENERGY: 200}, {NAME: 'delhi', ENERGY: 200}];
    fixture.detectChanges();
    component.definitions();
    const svg = getSvg();
    const width = component.element.nativeElement.clientWidth.toString();
    expect(svg.attr('width')).toBe(width);
    // expect(svg.attr('height')).toBe(component.element.nativeElement.clientHeight);
  });

  // it('Random String genration Success', () => {
  //   const CharLength = component.randomString(10);
  //   expect(CharLength.length).toEqual(10);
  // });
  it('Random String genration Success', () => {
    const CharLength = component.id;
    expect(CharLength.length).toEqual(14);
  });
  // it('Validating no data  function', () => {
  //   const svg: any = getSvg();
  //   fixture.detectChanges();
  //   component.noData();
  //   expect(svg._groups[0][0]).toBeNull();
  // });

  const getSvg = () => {
    return d3.select(`#${component.id} svg`);
  };
});
