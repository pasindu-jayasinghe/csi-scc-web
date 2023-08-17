
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoardMoreComponent } from './landing-page/loard-more/loard-more.component';
import { DashboardBaseComponent } from './dashboard-base/dashboard-base.component';
import { AuthGuard } from './auth/auth.guard';
import { LandingComponentComponent } from './landing-component/landing-component.component';
// import { UnitComponent } from './unit_/unit.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing-page', pathMatch: 'full' },

  { path: 'landing-page', component: LandingComponentComponent },
  { path: 'loard-more', component: LoardMoreComponent },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [],
    data: {}
  },


  {
    path: 'app',
    component: DashboardBaseComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [],
    data: {}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
