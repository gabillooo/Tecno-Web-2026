import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PermisosService } from '../../../../core/services/permisos.service';
import { TipoPermiso } from '../../../../core/models/permiso.model';

@Component({
  selector: 'app-permisos-disponibles',
  templateUrl: './permisos-disponibles.component.html',
  styleUrls: ['./permisos-disponibles.component.css'],
})
export class PermisosDisponiblesComponent implements OnInit {
  tiposPermiso$!: Observable<TipoPermiso[]>;

  constructor(private readonly permisosService: PermisosService) {}

  ngOnInit(): void {
    // El servicio comparte el catálogo y filtra los permisos inactivos.
    this.tiposPermiso$ = this.permisosService.listar(true);
  }
}
