import { Component, OnInit } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import {
  EstadoSolicitud,
  ESTADO_SOLICITUD_COLOR,
  ESTADO_SOLICITUD_LABEL,
} from '../../../../core/enums/estado-solicitud.enum';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { Usuario } from '../../../../core/models/usuario.model';
import { AuthService } from '../../../../core/services/auth.service';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css'],
})
export class MisSolicitudesComponent implements OnInit {
  usuario: Usuario | null = null;
  patentesEmitidas$!: Observable<Solicitud[]>;
  solicitudesEnSeguimiento$!: Observable<Solicitud[]>;

  constructor(
    private readonly auth: AuthService,
    private readonly solicitudesService: SolicitudesService
  ) {}

  ngOnInit(): void {
    this.usuario = this.auth.usuarioActual;
    const solicitudes$ = this.usuario
      ? this.solicitudesService.misSolicitudes(this.usuario.id)
      : of([] as Solicitud[]);

    this.patentesEmitidas$ = solicitudes$.pipe(
      map((solicitudes) => solicitudes.filter(
        (solicitud) =>
          solicitud.tipoPermisoId === 'patente' &&
          solicitud.estado === EstadoSolicitud.CERRADO
      ))
    );
    this.solicitudesEnSeguimiento$ = solicitudes$.pipe(
      map((solicitudes) => solicitudes.filter(
        (solicitud) =>
          solicitud.tipoPermisoId !== 'patente' ||
          solicitud.estado !== EstadoSolicitud.CERRADO
      ))
    );
  }

  nombreComercial(solicitud: Solicitud): string {
    return String(solicitud.datosFormulario['nombreComercial'] ?? solicitud.tipoPermisoNombre);
  }

  direccion(solicitud: Solicitud): string {
    return String(solicitud.datosFormulario['direccion'] ?? 'Dirección no informada');
  }

  etiqueta(estado: EstadoSolicitud): string {
    return ESTADO_SOLICITUD_LABEL[estado];
  }

  clasePill(estado: EstadoSolicitud): string {
    return 'pill--' + ESTADO_SOLICITUD_COLOR[estado];
  }
}
