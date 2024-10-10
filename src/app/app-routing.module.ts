import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ModuleExtensionComponent } from "./pages/module-extension/module-extension.component";
import { NodeconfigurationComponent } from "./pages/nodeconfiguration/nodeconfiguration.component";
import { DatasetsComponent } from "./pages/datasets/datasets.component";
import { MarketplaceComponent } from "./pages/marketplace/marketplace.component";
import { CreateprojectComponent } from "./pages/createproject/createproject.component"
import { HomepageComponent } from './pages/homepage/homepage.component';
import { MessageBoxComponent } from './component/message-box/message-box.component';


const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'moduleextention', component: ModuleExtensionComponent },
  { path: 'nodeconfiguration', component: NodeconfigurationComponent },
  { path: 'datasets', component: DatasetsComponent },
  { path: 'marketplace', component: MarketplaceComponent },
  { path: 'createproject', component: CreateprojectComponent },
  {
    path: "message-box",
    component: MessageBoxComponent
  }
  //{ path: '', redirectTo: '/project', pathMatch: 'full' },  // Optional default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    //{ enableTracing: true }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
