import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as d3 from 'd3';
import { Colors } from 'src/app/colors.constants';
import { StackLineComponent } from './stack-line.component';

describe('StackLineComponent', () => {
  let component: StackLineComponent;
  let fixture: ComponentFixture<StackLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StackLineComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.definitions();
  });

  it('stack line graph Component initialized', () => {
    expect(component).toBeTruthy();
  });

  it('stack Line component: SVG Rendered', () => {
    expect(getSvg()).not.toBeNull();
  });

  it('Validating svg width', () => {
    component.data = [
      {
        DEVICE_TIME: 'Tue Apr 28 2020 00:30:00 GMT+0530 (India Standard Time)',
        ENERGY: 18.140103973000002, STACK_ENERGY: [{ AREA: 'POI2', DEVICE_ID: '00000086', ENERGY: 0.259999987 },
        { AREA: 'POI6', DEVICE_ID: '00000087', ENERGY: 1.70999995 },
        { AREA: 'POI6', DEVICE_ID: '00000091', ENERGY: 15.1101074 },
        { AREA: 'POI3', DEVICE_ID: '00000092', ENERGY: 0.04 },
        { AREA: 'POI7', DEVICE_ID: '00000089', ENERGY: 0.9800033499999999 },
        { AREA: 'POI4', DEVICE_ID: '00000088', ENERGY: 0.039993286 }],
        '00000086': 0.259999987, '00000087': 1.70999995, '00000088': 0.039993286, '00000089': 0.9800033499999999,
        '00000091': 15.1101074, '00000092': 0.04
      },
      {
        DEVICE_TIME: 'Tue Apr 28 2020 02:30:00 GMT+0530 (India Standard Time)',
        ENERGY: 109.16980528800002, STACK_ENERGY: [{ AREA: 'POI3', DEVICE_ID: '00000092', ENERGY: 0.24 },
        { AREA: 'POI6', DEVICE_ID: '00000091', ENERGY: 89.03979510000002 },
        { AREA: 'POI7', DEVICE_ID: '00000089', ENERGY: 6.1200027 },
        { AREA: 'POI4', DEVICE_ID: '00000088', ENERGY: 0.360008235 },
        { AREA: 'POI6', DEVICE_ID: '00000087', ENERGY: 11.42999937 },
        { AREA: 'POI2', DEVICE_ID: '00000086', ENERGY: 1.979999883 }],
        '00000086': 1.979999883,
        '00000087': 11.42999937,
        '00000088': 0.360008235,
        '00000089': 6.1200027,
        '00000091': 89.03979510000002,
        '00000092': 0.24
      }];
    component.xAxis = 'DEVICE_TIME';
    component.yAxis = 'ENERGY';
    component.yAxisLabel = [];
    component.keys = ['00000086', '00000092', '00000088', '00000087', '00000091', '00000089'];
    component.legends = ['POI2', 'POI3', 'POI4', 'POI6', 'POI6-1', 'POI7'];
    component.colors = Colors.colors;
    // component.colors = ['#002496', '#0978AF', '#5400D0', '#CC00CC', '#C40000', '#DE5A00', '#996600', '#FCF600',
    //  '#669900', '#339966', '#5684EE', '#9356EE', '#EE5661', '#56C0EE', '#E97F02', '#F8CA00', '#8A9B0F', '#594F4F',
    //   '#547980', '#45ADA8', '#9DE0AD', '#E5FCC2', '#00A0B0', '#6A4A3C', '#CC333F', '#EB6841', '#EDC951', '#E94E77',
    //    '#D68189', '#C6A49A', '#C6E5D9', '#F4EAD5', '#D9CEB2', '#948C75', '#D5DED9', '#7A6A53', '#99B2B7', '#FFFFFF',
    //     '#CBE86B', '#F2E9E1', '#1C140D', '#CBE86B', '#EFFFCD', '#DCE9BE', '#555152', '#2E2633', '#99173C', '#3FB8AF',
    //      '#7FC7AF', '#DAD8A7', '#FF9E9D', '#FF3D7F', '#343838', '#005F6B', '#008C9E', '#00B4CC', '#00DFFC',
    //       '#413E4A', '#73626E', '#B38184', '#F0B49E', '#F7E4BE', '#99B898', '#FECEA8', '#FF847C', '#E84A5F',
    //        '#2A363B', '#FF4E50', '#FC913A', '#F9D423', '#EDE574', '#E1F5C4', '#554236', '#F77825', '#D3CE3D',
    //         '#F1EFA5', '#60B99A', '#351330', '#424254', '#64908A', '#E8CAA4', '#CC2A41', '#00A8C6', '#40C0CB',
    //          '#F9F2E7', '#AEE239', '#8FBE00', '#FF4242', '#F4FAD2', '#D4EE5E', '#E1EDB9', '#F0F2EB', '#655643',
    //           '#80BCA3', '#F6F7BD', '#E6AC27', '#BF4D28', '#8C2318', '#5E8C6A', '#88A65E'];
    component.view = 'hour';
    component.secondary = undefined;
    component.active = true;
    fixture.detectChanges();
    component.definitions();
    const svg = getSvg();
    const yLabel = component.yAxisLabel[0] ? 40 : 0;
    const width = component.width.toString();
    const height = component.height.toString();
    expect(svg.attr('width')).toBe(width);
    expect(svg.attr('height')).toBe(height);
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
