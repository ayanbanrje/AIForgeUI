import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputComponent } from './commonComponent/input/input.component';
import { ButtonComponent } from './commonComponent/button/button.component';
import { ModuleExtensionComponent } from './pages/module-extension/module-extension.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { MenuComponent } from './menu/menu.component';
import { NodeconfigurationComponent } from './pages/nodeconfiguration/nodeconfiguration.component';
import { DatasetsComponent } from './pages/datasets/datasets.component';
import { MarketplaceComponent } from './pages/marketplace/marketplace.component';
import { CreateprojectComponent } from './pages/createproject/createproject.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { HomePageCardComponent } from './component/home-page-card/home-page-card.component';
//import { ProjectsComponent } from './modules/projects/projects.component';

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
    //ProjectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
