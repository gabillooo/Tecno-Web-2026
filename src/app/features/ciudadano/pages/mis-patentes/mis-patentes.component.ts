import { Component, OnInit } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import {
  EstadoSolicitud,
  ESTADO_SOLICITUD_LABEL
} from '../../../../core/enums/estado-solicitud.enum';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { Usuario } from '../../../../core/models/usuario.model';
import { AuthService } from '../../../../core/services/auth.service';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';

@Component({
  selector: 'app-mis-patentes',
  templateUrl: './mis-patentes.component.html',
  styleUrls: ['./mis-patentes.component.css']
})
export class MisPatentesComponent implements OnInit {
  usuario: Usuario | null = null;
  patentesEmitidas$!: Observable<Solicitud[]>;
  solicitudesPatentes$!: Observable<Solicitud[]>;

  constructor(
    private readonly auth: AuthService,
    private readonly solicitudesService: SolicitudesService
  ) {}

  ngOnInit(): void {
    this.usuario = this.auth.usuarioActual;
    const solicitudes$ = this.usuario
      ? this.solicitudesService.misSolicitudes(this.usuario.id).pipe(
          map((solicitudes) => solicitudes.filter((solicitud) => solicitud.tipoPermisoId === 'patente'))
        )
      : of([]);

    this.patentesEmitidas$ = solicitudes$.pipe(
      map((solicitudes) => solicitudes.filter((solicitud) => solicitud.estado === EstadoSolicitud.CERRADO))
    );
    this.solicitudesPatentes$ = solicitudes$.pipe(
      map((solicitudes) => solicitudes.filter((solicitud) => solicitud.estado !== EstadoSolicitud.CERRADO))
    );
  }

  nombreComercial(solicitud: Solicitud): string {
    return String(solicitud.datosFormulario['nombreComercial'] ?? 'Patente comercial');
  }

  direccion(solicitud: Solicitud): string {
    return String(solicitud.datosFormulario['direccion'] ?? 'Dirección no informada');
  }

  estadoLabel(solicitud: Solicitud): string {
    return ESTADO_SOLICITUD_LABEL[solicitud.estado];
  }
}
