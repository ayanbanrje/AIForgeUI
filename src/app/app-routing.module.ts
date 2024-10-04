import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ProjectsComponent } from './modules/projects/projects.component'; 
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  // { path: 'project', component: ProjectsComponent },
  { path: 'login', component: LoginComponent },  
  { path: '', redirectTo: '/project', pathMatch: 'full' },  // Optional default route
  { path: '**', redirectTo: '/project' }  // 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
