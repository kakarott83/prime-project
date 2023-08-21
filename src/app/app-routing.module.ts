import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TravelListComponent } from './business/list/travel-list/travel-list.component';
import { TravelFormComponent } from './business/travel-form/travel-form.component';
import { LoginFormComponent } from './login/login-form/login-form.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    component: LoginFormComponent,
  },
  {
    path: 'travel-list',
    component: TravelListComponent,
  },
  {
    path: 'travel/:id',
    component: TravelFormComponent,
  },
  {
    path: 'new-travel',
    component: TravelFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
