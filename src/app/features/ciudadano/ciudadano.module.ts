import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeCiudadanoComponent } from './pages/home-ciudadano/home-ciudadano.component';
import { PerfilCiudadanoComponent } from './pages/perfil/perfil-ciudadano.component';

import { PermisosDisponiblesComponent } from './pages/permisos-disponibles/permisos-disponibles.component';

const routes: Routes = [
  { path: 'permisos', component: PermisosDisponiblesComponent },
  { path: 'perfil', component: PerfilCiudadanoComponent },
  { path: '', pathMatch: 'full', component: HomeCiudadanoComponent },
];

@NgModule({
  declarations: [HomeCiudadanoComponent, PerfilCiudadanoComponent, PermisosDisponiblesComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class CiudadanoModule {}
