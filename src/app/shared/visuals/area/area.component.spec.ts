import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppServiceHelper } from 'src/app/helpers/app.helper.service';
import { AreaComponent } from './area.component';
import * as d3 from 'd3';

fdescribe('AreaComponent', () => {
  let component: AreaComponent;
  let fixture: ComponentFixture<AreaComponent>;
  // let appHelper: AppServiceHelper;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AreaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.definition();
  });

  it('Area line graph Component initialized', () => {
    expect(component).toBeTruthy();
  });

  it('Area Line component: SVG Rendered', () => {
    expect(getSvg()).not.toBeNull();
  });

  it('Validating svg width', () => {
    component.data = [
      { DEVICE_TIME: 'Tue Apr 28 2020 00:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.3300000390000002 },
      { DEVICE_TIME: 'Tue Apr 28 2020 02:30:00 GMT+0530 (India Standard Time)', ENERGY: 9.569999430000001 },
      { DEVICE_TIME: 'Tue Apr 28 2020 03:30:00 GMT+0530 (India Standard Time)', ENERGY: 2.429999799 },
      { DEVICE_TIME: 'Tue Apr 28 2020 04:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.7400011639999997 },
      { DEVICE_TIME: 'Tue Apr 28 2020 05:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.590000612 },
      { DEVICE_TIME: 'Tue Apr 28 2020 06:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.7699976090000002 }];
    component.xAxis = 'DEVICE_TIME';
    component.yAxis = 'ENERGY';
    component.yAxisLabel = [];
    component.averageLine = 2.8056248564375;
    component.areacolor = '#804AB9';
    component.basiccolor = {linecolor: '#50237F', averageColor: '#E6A789'};
    component.legends = [{label: 'Actual Energy Consumption'}, {label: 'Average Energy Consumption'}];
    component.backgroundtooltip = '#000000';
    component.view = 'hour';
    component.status = true;
    component.statusColor = 'rgb(59, 201, 0)';
    fixture.detectChanges();
    component.definition();
    const svg = getSvg();
    const yLabel = component.yAxisLabel[0] ? 40 : 0;
    const width = (component.width + component.margin.left - yLabel).toString();
    const height = (component.height + component.margin.top + component.margin.bottom).toString();
    expect(svg.attr('width')).toBe(width);
    expect(svg.attr('height')).toBe(height);
  });

  it('Random String genration Success', () => {
    // const CharLength1 = component.appHelper.randomString(10);
    // const CharLength1 = AppServiceHelper.randomString(10);
    const CharLength = component.id;
    expect(CharLength.length).toEqual(12);
  });

  it('Validating no data  function', () => {
    const svg: any = getSvg();
    fixture.detectChanges();
    component.noData();
    expect(svg._groups[0][0]).toBeNull();
  });

  it('ngonchanges function', () => {
    component.data = [
      { DEVICE_TIME: 'Tue Apr 28 2020 00:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.3300000390000002 },
      { DEVICE_TIME: 'Tue Apr 28 2020 02:30:00 GMT+0530 (India Standard Time)', ENERGY: 9.569999430000001 },
      { DEVICE_TIME: 'Tue Apr 28 2020 03:30:00 GMT+0530 (India Standard Time)', ENERGY: 2.429999799 },
      { DEVICE_TIME: 'Tue Apr 28 2020 04:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.7400011639999997 },
      { DEVICE_TIME: 'Tue Apr 28 2020 05:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.590000612 },
      { DEVICE_TIME: 'Tue Apr 28 2020 06:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.7699976090000002 }];
    component.xAxis = 'DEVICE_TIME';
    component.yAxis = 'ENERGY';
    component.yAxisLabel = [];
    component.averageLine = 2.8056248564375;
    component.areacolor = '#804AB9';
    component.basiccolor = {linecolor: '#50237F', averageColor: '#E6A789'};
    component.legends = [{label: 'Actual Energy Consumption'}, {label: 'Average Energy Consumption'}];
    component.backgroundtooltip = '#000000';
    component.view = 'hour';
    component.status = true;
    component.statusColor = 'rgb(59, 201, 0)';
    component.ngOnChanges();
    spyOn(component, 'definition');
    fixture.detectChanges();
    expect(component.definition()).toHaveBeenCalled();
  });

  it('Validating Length of svg', () => {
    component.data = [
      { DEVICE_TIME: 'Tue Apr 28 2020 00:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.3300000390000002 },
      { DEVICE_TIME: 'Tue Apr 28 2020 02:30:00 GMT+0530 (India Standard Time)', ENERGY: 9.569999430000001 },
      { DEVICE_TIME: 'Tue Apr 28 2020 03:30:00 GMT+0530 (India Standard Time)', ENERGY: 2.429999799 },
      { DEVICE_TIME: 'Tue Apr 28 2020 04:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.7400011639999997 },
      { DEVICE_TIME: 'Tue Apr 28 2020 05:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.590000612 },
      { DEVICE_TIME: 'Tue Apr 28 2020 06:30:00 GMT+0530 (India Standard Time)', ENERGY: 1.7699976090000002 }];
    component.xAxis = 'DEVICE_TIME';
    component.yAxis = 'ENERGY';
    component.yAxisLabel = [];
    component.averageLine = 2.8056248564375;
    component.areacolor = '#804AB9';
    component.basiccolor = {linecolor: '#50237F', averageColor: '#E6A789'};
    component.legends = [{label: 'Actual Energy Consumption'}, {label: 'Average Energy Consumption'}];
    component.backgroundtooltip = '#000000';
    component.view = 'hour';
    component.status = true;
    component.statusColor = 'rgb(59, 201, 0)';
    fixture.detectChanges();
    component.definition();
    const compiled = fixture.debugElement.nativeElement;
    const li = compiled.querySelector('.item.area').querySelectorAll('svg').length;
    expect(li).toBe(1);
});

  const getSvg = () => {
    return d3.select(`#${component.id} svg`);
  };
});
