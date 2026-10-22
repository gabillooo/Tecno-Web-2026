import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeCiudadanoComponent } from './pages/home-ciudadano/home-ciudadano.component';

const routes: Routes = [
  { path: '', component: HomeCiudadanoComponent },
];

@NgModule({
  declarations: [HomeCiudadanoComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class CiudadanoModule {}
