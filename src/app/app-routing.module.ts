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
import { AuthGuardService as AuthGuard } from './services/auth/auth-guard.service';
import { RoleGuardService as RoleGuard } from './services/auth/role-guard.service';

const routes: Routes = [
  {
    path: '', component: HomepageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: ['SUPERUSER']
    }
  },

  {
    path: 'projects', component: ProjectsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: ['SUPERUSER']
    }
  },
  {
    path: 'moduleextention', component: ModuleExtensionComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: ['SUPERUSER']
    }
  },
  {
    path: 'nodeconfiguration', component: NodeconfigurationComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: ['SUPERUSER']
    }
  },
  {
    path: 'datasets', component: DatasetsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: ['SUPERUSER']
    }
  },
  {
    path: 'marketplace', component: MarketplaceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: ['SUPERUSER']
    }
  },
  {
    path: 'createproject', component: CreateprojectComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: ['SUPERUSER']
    }
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }

  //{ path: '', redirectTo: '/project', pathMatch: 'full' },  // Optional default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    //{ enableTracing: true }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
