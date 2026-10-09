import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import {
  EstadoSolicitud,
  ESTADO_SOLICITUD_COLOR,
  ESTADO_SOLICITUD_LABEL,
} from '../../../../core/enums/estado-solicitud.enum';

/**
 * Bandeja de solicitudes para el administrador: filtrar por estado/tipo,
 * y resolver (aprobar / rechazar / observar / emitir).
 * TODO: filtros reactivos, modal de resolución con mensaje obligatorio para observar/rechazar.
 */
@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css'],
})
export class SolicitudesComponent implements OnInit {
  solicitudes$!: Observable<Solicitud[]>;

  constructor(private readonly solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.solicitudes$ = this.solicitudesService.listarTodas();
  }

  aprobar(id: string): void {
    this.solicitudesService.resolver({ solicitudId: id, accion: 'APROBAR' }).subscribe();
  }

  rechazar(id: string): void {
    this.solicitudesService
      .resolver({ solicitudId: id, accion: 'RECHAZAR', mensaje: 'Faltan antecedentes obligatorios.' })
      .subscribe();
  }

  etiqueta(estado: EstadoSolicitud): string {
    return ESTADO_SOLICITUD_LABEL[estado];
  }

  clasePill(estado: EstadoSolicitud): string {
    return 'pill--' + ESTADO_SOLICITUD_COLOR[estado];
  }
}
