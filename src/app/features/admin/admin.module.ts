import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminLayoutComponent } from './layout/admin-layout.component';
import { CatalogoPermisosComponent } from './pages/catalogo-permisos/catalogo-permisos.component';
import { SolicitudesComponent } from './pages/solicitudes/solicitudes.component';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    CatalogoPermisosComponent,
    SolicitudesComponent,
    HomeAdminComponent,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AdminRoutingModule],
})
export class AdminModule {}
