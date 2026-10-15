import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import {
  EstadoSolicitud,
  ESTADO_SOLICITUD_COLOR,
  ESTADO_SOLICITUD_LABEL,
} from '../../../../core/enums/estado-solicitud.enum';

/**
 * Estadísticas básicas: volumen de solicitudes por tipo y por estado.
 * TODO: gráficos (barras/torta) con una librería liviana, ej. ngx-charts.
 */
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css'],
})
export class EstadisticasComponent implements OnInit {
  estadisticas$!: Observable<{ porEstado: Record<string, number>; porTipo: Record<string, number> }>;

  constructor(private readonly solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.estadisticas$ = this.solicitudesService.estadisticas();
  }

  etiqueta(clave: string): string {
    return ESTADO_SOLICITUD_LABEL[clave as EstadoSolicitud] ?? clave;
  }

  clasePill(clave: string): string {
    return 'pill--' + (ESTADO_SOLICITUD_COLOR[clave as EstadoSolicitud] ?? 'gris');
  }
}
