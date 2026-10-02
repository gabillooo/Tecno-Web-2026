import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { CatalogoPermisosComponent } from './pages/catalogo-permisos/catalogo-permisos.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: HomeAdminComponent },
      { path: 'solicitudes', component: SolicitudesComponent },
      { path: 'catalogo', component: CatalogoPermisosComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
