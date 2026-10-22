import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { CatalogoPermisosComponent } from './pages/catalogo-permisos/catalogo-permisos.component';
import { NuevoTipoPermisoComponent } from './pages/nuevo-tipo-permiso/nuevo-tipo-permiso.component';
import { EditarTipoPermisoComponent } from './pages/editar-tipo-permiso/editar-tipo-permiso.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { EstadisticasComponent } from './pages/estadisticas/estadisticas.component';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';
import { PerfilAdminComponent } from './pages/perfil/perfil-admin.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    CatalogoPermisosComponent,
    NuevoTipoPermisoComponent,
    EditarTipoPermisoComponent,
    SolicitudesComponent,
    EstadisticasComponent,
    HomeAdminComponent,
    PerfilAdminComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AdminRoutingModule],
})
export class AdminModule {}
