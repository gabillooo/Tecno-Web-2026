import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';
import { CatalogoPermisosComponent } from './pages/catalogo-permisos/catalogo-permisos.component';
import { NuevoTipoPermisoComponent } from './pages/nuevo-tipo-permiso/nuevo-tipo-permiso.component';
import { EditarTipoPermisoComponent } from './pages/editar-tipo-permiso/editar-tipo-permiso.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';
import { PerfilAdminComponent } from './pages/perfil/perfil-admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', component: HomeAdminComponent },
      { path: 'perfil', component: PerfilAdminComponent },
      { path: 'solicitudes', component: SolicitudesComponent },
      { path: 'catalogo/nuevo', component: NuevoTipoPermisoComponent },
      { path: 'catalogo/:id/editar', component: EditarTipoPermisoComponent },
      { path: 'catalogo', component: CatalogoPermisosComponent },
      { path: 'estadisticas', component: EstadisticasComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
