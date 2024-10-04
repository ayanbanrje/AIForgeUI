import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as d3 from 'd3';
import { Colors } from 'src/app/colors.constants';
import { PieComponent } from './pie.component';

fdescribe('PieComponent', () => {
  let component: PieComponent;
  let fixture: ComponentFixture<PieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PieComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.load();
  });

  it('Pie component should be initialised', () => {
    expect(component).toBeTruthy();
  });

  it('Pie component: SVG Rendered', () => {
    expect(getSvg()).not.toBeNull();
  });

  it('Random String genration Success', () => {
    const CharLength = component.randomString(10);
    expect(CharLength.length).toEqual(10);
  });

  it('Validating svg width', () => {
    component.data = {
      POI2: 27.729995697000007,
      POI3: 10.640000221,
      POI4: 146.310002139,
      POI6: 633.8099966000001,
      // POI6- 1: 96.34999932799998,
      POI7: 50.36999913000001
    };
    component.legendflag = undefined;                    // flag to toggle legend view in 3rd pie chart
    component.pielabel = 35.00;
    component.pie3label = 34;                     // label to show at centre of every pie
    component.colors = Colors.colors;
    component.labels = true;
    component.disabled = false;
    component.values = false;
    // component.mains = 35;
    component.rotate = true;
    component.minLabelWidth = 10;
    component.labelColor = '#B90276';
    fixture.detectChanges();
    component.load();
    const svg = getSvg();
    const width = component.width.toString();
    const height = component.height.toString();
    expect(svg.attr('width')).toBe(width);
    expect(svg.attr('height')).toBe(height);
  });

  it('Validating no data  function', () => {
    const svg: any = getSvg();
    fixture.detectChanges();
    component.noData();
    expect(svg._groups[0][0]).toBeNull();
  });

  it('Validating Length of svg', () => {
    component.data = {
      POI2: 27.729995697000007,
      POI3: 10.640000221,
      POI4: 146.310002139,
      POI6: 633.8099966000001,
      // POI6- 1: 96.34999932799998,
      POI7: 50.36999913000001
    };
    component.legendflag = undefined;                    // flag to toggle legend view in 3rd pie chart
    component.pielabel = 35.00;
    component.pie3label = 34;                     // label to show at centre of every pie
    component.colors = Colors.colors;
    component.labels = true;
    component.disabled = false;
    component.values = false;
    // component.mains = 35;
    component.rotate = true;
    component.minLabelWidth = 10;
    component.labelColor = '#B90276';
    fixture.detectChanges();
    component.load();
    const compiled = fixture.debugElement.nativeElement;
    const li = compiled.querySelector('.pie-container').querySelectorAll('svg').length;
    expect(li).toBe(1);
});

  const getSvg = () => {
    return d3.select(`#${component.id} div.pie-container svg`);
  };
});
