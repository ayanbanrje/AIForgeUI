import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { InputComponent } from './commonComponent/input/input.component';
import { ButtonComponent } from './commonComponent/button/button.component';
import { ModuleExtensionComponent } from './pages/module-extension/module-extension.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { MenuComponent } from './menu/menu.component';
import { NodeconfigurationComponent } from './pages/nodeconfiguration/nodeconfiguration.component';
import { NodeConfigurationService } from './services/backend/node-configuration.service';  // Import service
import { DatasetsComponent } from './pages/datasets/datasets.component';
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { CreateprojectComponent } from './pages/createproject/createproject.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { HomePageCardComponent } from './card/home-page-card/home-page-card.component';
import { ChildModuleExtensionComponent } from './card/child-module-extension/child-module-extension.component';
import { MessageBoxComponent } from './commonComponent/message-box/message-box.component';
import { ModalComponent } from './commonComponent/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { CheckboxComponent } from './commonComponent/checkbox/checkbox.component';
import { LoadingComponent } from './commonComponent/loading/loading.component';
import { TextareaComponent } from './commonComponent/textarea/textarea.component';
import { FileUploadComponent } from './commonComponent/file-upload/file-upload.component';
//import { ProjectsComponent } from './modules/projects/projects.component';
import { SelectDropdownComponent } from './commonComponent/select-dropdown/select-dropdown.component';
import { ToastBoxComponent } from './commonComponent/toast-box/toast-box.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    ButtonComponent,
    ModuleExtensionComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    ProjectsComponent,
    MenuComponent,
    NodeconfigurationComponent,
    DatasetsComponent,
    MarketplaceComponent,
    CreateprojectComponent,
    HomepageComponent,
    HomePageCardComponent,
    ChildModuleExtensionComponent,
    MessageBoxComponent,
    ModalComponent,
    SelectDropdownComponent,
    CheckboxComponent,
    LoadingComponent,
    TextareaComponent,
    FileUploadComponent,
    //ProjectsComponent
    ToastBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    provideClientHydration(),
    NodeConfigurationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
