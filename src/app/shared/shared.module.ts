import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProcessFlowComponent } from "./process-flow/process-flow.component";
import { BasicDetailsComponent } from "./sections/basic-details/basic-details.component";
import { MultiselectBasicDetailsComponent } from "./sections/multiselect-basic-details/multiselect-basic-details.component";
import { ModalComponent } from "./modal/modal.component";
import { DropdownComponent } from "./form-elements/dropdown/dropdown.component";
import { FormDesignerComponent } from "./form-elements/form-designer/form-designer.component";
import { ButtonComponent } from "./form-elements/button/button.component";
import { CheckboxComponent } from "./form-elements/checkbox/checkbox.component";
import { RadioComponent } from "./form-elements/radio/radio.component";
import { DateListComponent } from "./date-list/date-list.component";
import { StackLineComponent } from "./visuals/stack-line/stack-line.component";
import { AreaComponent } from "./visuals/area/area.component";
import { PieComponent } from "./visuals/pie/pie.component";
import { MultiLineComponent } from "./visuals/multi-line/multi-line.component";
import { MapComponent } from "./visuals/map/map.component";
import { NumberComponent } from "./form-elements/number/number.component";
import { NavigationComponent } from "./sections/navigation/navigation.component";
import { TableComponent } from "./sections/table/table.component";
import { GlobalMapComponent } from "./visuals/global-map/global-map.component";
import { HorizontalStackBarComponent } from "./visuals/horizontal-stack-bar/horizontal-stack-bar.component";
import { ArcComponent } from "./visuals/arc/arc.component";
import { D3GlobalMapComponent } from "./visuals/d3-global-map/d3-global-map.component";
import { MultiLine2Component } from "./visuals/multi-line2/multi-line2.component";
import { InfoTooltipComponent } from "./info-tooltip/info-tooltip.component";
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { ToggleButtonComponent } from "./sections/toggle-button/toggle-button.component";
import { InputComponent } from "./form-elements/input/input.component";
import { HbarComponent } from "./visuals/hbar/hbar.component";
import { GanntChartComponent } from "./visuals/gannt-chart/gannt-chart.component";
import { MultiSelectComponent } from "./form-elements/multi-select/multi-select.component";
import { HalfPieComponent } from './visuals/half-pie/half-pie.component';
import { TreemapComponent } from './visuals/treemap/treemap.component';
import { GroupedMixedBarComponent } from "./visuals/grouped-mixed-bar/grouped-mixed-bar.component";

@NgModule({
  declarations: [
    ProcessFlowComponent,
    BasicDetailsComponent,
    MultiselectBasicDetailsComponent,
    ModalComponent,
    DropdownComponent,
    FormDesignerComponent,
    ButtonComponent,
    CheckboxComponent,
    RadioComponent,
    DateListComponent,
    StackLineComponent,
    AreaComponent,
    PieComponent,
    MultiLineComponent,
    MapComponent,
    NumberComponent,
    NavigationComponent,
    TableComponent,
    GlobalMapComponent,
    HorizontalStackBarComponent,
    ArcComponent,
    D3GlobalMapComponent,
    MultiLine2Component,
    InfoTooltipComponent,
    ToggleButtonComponent,
    InputComponent,
    HbarComponent,
    GanntChartComponent,
    MultiSelectComponent,
    HalfPieComponent,
    TreemapComponent,
    GroupedMixedBarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    HttpClientModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NavigationComponent,
    ProcessFlowComponent,
    BasicDetailsComponent,
    MultiselectBasicDetailsComponent,
    ModalComponent,
    FormDesignerComponent,
    ButtonComponent,
    StackLineComponent,
    AreaComponent,
    MultiLineComponent,
    PieComponent,
    GlobalMapComponent,
    HorizontalStackBarComponent,
    ArcComponent,
    D3GlobalMapComponent,
    MultiLine2Component,
    TableComponent,
    DropdownComponent,
    InfoTooltipComponent,
    ToggleButtonComponent,
    InputComponent,
    CheckboxComponent,
    HbarComponent,
    MapComponent,
    GanntChartComponent,
    MultiSelectComponent,
    NumberComponent,
    HalfPieComponent,
    TreemapComponent,
    GroupedMixedBarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
