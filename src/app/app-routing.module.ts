import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { homeRedirectGuard } from './core/guards/home-redirect.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [homeRedirectGuard],
    children: []
  },
  {
    path: '**',
    pathMatch: 'full',
    canActivate: [homeRedirectGuard],
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
