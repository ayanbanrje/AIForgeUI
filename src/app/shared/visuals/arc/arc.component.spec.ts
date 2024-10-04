import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as d3 from 'd3';
import { ArcComponent } from './arc.component';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { NoCommaPipe } from './../../../pipes/no-comma.pipe';

fdescribe('ArcComponent', () => {
  let component: ArcComponent;
  let fixture: ComponentFixture<ArcComponent>;
  // let c;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ArcComponent, NoCommaPipe],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // component.arcDefinitions();
    component.loader();
  });

  it(' Arc Component initialized', () => {
    // component.data = {
    //   target : 200,
    //   value : 100,
    //   shadow : 0
    // };
    // component.definitions = {
    //   radius: {
    //     inner: 70,
    //     outer: 50,
    //     corner: 10
    //   },
    //   size: 170
    // };
    // fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  // it('Arc component: SVG Rendered', () => {
  //   expect(getSvg()).not.toBeNull();
  // });

  // it('should append the right number of arc to the DOM',  () => {
  //   fixture = TestBed.createComponent(ArcComponent);
  //   fixture.detectChanges();
  //   expect(Object.keys(this.data).length).toEqual({this.d3.svg.length});
  // });

  it('Validating svg width', () => {
    component.data = {
      value: 950,
      target: 570,
      shadow: 0
    };
    fixture.detectChanges();
    // component.arcDefinitions();
    component.loader();
    const svg = getSvg();
    const definedRatio = '170px';
    expect(svg.attr('width')).toBe(definedRatio);
    expect(svg.attr('height')).toBe(definedRatio);
    expect(svg.attr('height')).toBe(svg.attr('width'));
  });

  // it('Validating svg width with value less than target ', () => {
  //   component.data = {
  //     value: 350,
  //     target: 570,
  //     shadow: 0
  //   };
  //   fixture.detectChanges();
  //   // component.arcDefinitions();
  //   component.loader();
  //   const svg = getSvg();
  //   const definedRatio = '170px';
  //   expect(svg.attr('width')).toBe(definedRatio);
  //   expect(svg.attr('height')).toBe(definedRatio);
  //   expect(svg.attr('height')).toBe(svg.attr('width'));
  // });

  // it('Random String genration Success', () => {
  //   const CharLength = component.randomString(10);
  //   expect(CharLength.length).toEqual(10);
  // });
  // it('Random String genration Success', () => {
  //   const CharLength = component.id;
  //   expect(CharLength.length).toEqual(10);
  // });

  // it('Validating no data  function', () => {
  //   const svg: any = getSvg();
  //   fixture.detectChanges();
  //   component.noData();
  //   expect(svg._groups[0][0]).toBeNull();
  // });

  // it('ngonchanges function', () => {
  //   component.data = {
  //     value: 950,
  //     target: 570,
  //     shadow: 0
  //   };
  //   component.ngOnChanges();
  //   fixture.detectChanges();
  //   // expect(component.target).toBe(component.data.target);
  //   expect(component.data.shadow).toBe(component.data.target + 50);
  // });

  // it('Validating Length of svg', () => {
  //   component.data = {
  //     value: 950,
  //     target: 570,
  //     shadow: 0
  //   };
  //   fixture.detectChanges();
  //   // component.arcDefinitions();
  //   component.loader();
  //   const compiled = fixture.debugElement.nativeElement;
  //   const li = compiled.querySelectorAll('.svg-s');
  //   let count = 0;
  //   li.forEach((list, i) => {
  //     count = count + list.querySelectorAll('svg').length;
  //   });
  //   expect(count).toBe(3);
  //   // const length = compiled.querySelector('.arc').childElementCount - 1;
  //   // expect(length).toBe(3);
  // });


  function getSvg() {
    return d3.select(`#${component.id} svg`);
  }


});
