import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, take, switchMap, throwError } from 'rxjs';
import {
  AvanzarPasoDto,
  ComprobantePago,
  FiltroSolicitudes,
  ResolverSolicitudDto,
  Solicitud
} from '../models/solicitud.model';
import { EstadoSolicitud } from '../enums/estado-solicitud.enum';
import { AuthService } from './auth.service';
import { PermisosService } from './permisos.service';

@Injectable({ providedIn: 'root' })
export class SolicitudesService {
  private readonly datos = new BehaviorSubject<Solicitud[]>([
    {
      id: 'sol-1',
      folio: 'SOL-2026-000123',
      tipoPermisoId: 'patente',
      tipoPermisoNombre: 'Patente comercial',
      solicitanteId: 'u-maria-rojas',
      solicitanteNombre: 'María Fernanda Rojas',
      estado: EstadoSolicitud.EN_REVISION,
      datosFormulario: { direccion: 'Av. Siempre Viva 123' },
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-09-01',
      fechaActualizacion: '2026-09-05'
    },
    {
      id: 'sol-2',
      folio: 'SOL-2026-000124',
      tipoPermisoId: 'evento',
      tipoPermisoNombre: 'Autorización de eventos',
      solicitanteId: 'u-carlos-munoz',
      solicitanteNombre: 'Carlos Andrés Muñoz',
      estado: EstadoSolicitud.RESUELTO,
      datosFormulario: {
        direccion: 'Plaza Central s/n',
        nombreEvento: 'Feria de emprendedores',
        fechaEvento: '2026-10-12'
      },
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-08-20',
      fechaActualizacion: '2026-08-28'
    },
    {
      id: 'sol-3',
      folio: 'SOL-2026-000125',
      tipoPermisoId: 'via',
      tipoPermisoNombre: 'Ocupación de vía pública',
      solicitanteId: 'u-javiera-soto',
      solicitanteNombre: 'Javiera Ignacia Soto',
      estado: EstadoSolicitud.RECHAZADO,
      datosFormulario: {
        direccion: 'Calle Los Robles 456',
        motivo: 'Instalación de andamios'
      },
      documentos: [],
      observaciones: [
        {
          id: 'obs-1',
          fecha: '2026-08-19',
          autor: 'Admin',
          mensaje:
            'No cumple con las medidas de seguridad exigidas para vías con alto tránsito.',
          resuelta: false
        }
      ],
      fechaCreacion: '2026-08-15',
      fechaActualizacion: '2026-08-19'
    },
    {
      id: 'sol-4',
      folio: 'SOL-2026-000126',
      tipoPermisoId: 'patente',
      tipoPermisoNombre: 'Patente comercial',
      solicitanteId: 'u-rodrigo-vargas',
      solicitanteNombre: 'Rodrigo Esteban Vargas',
      estado: EstadoSolicitud.CERRADO,
      datosFormulario: { direccion: 'Av. Providencia 2200' },
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-07-10',
      fechaActualizacion: '2026-07-22'
    },
    {
      id: 'sol-5',
      folio: 'SOL-2026-000127',
      tipoPermisoId: 'evento',
      tipoPermisoNombre: 'Autorización de eventos',
      solicitanteId: 'u-antonia-herrera',
      solicitanteNombre: 'Antonia Belén Herrera',
      estado: EstadoSolicitud.EN_PROCESO,
      datosFormulario: {
        direccion: 'Parque Municipal',
        nombreEvento: 'Concierto benéfico'
      },
      documentos: [],
      observaciones: [
        {
          id: 'obs-2',
          fecha: '2026-09-14',
          autor: 'Admin',
          mensaje:
            'Falta certificado de seguridad del recinto. Debe adjuntarlo para continuar.',
          resuelta: false
        }
      ],
      fechaCreacion: '2026-09-10',
      fechaActualizacion: '2026-09-14'
    },
    {
      id: 'sol-6',
      folio: 'SOL-2026-000128',
      tipoPermisoId: 'via',
      tipoPermisoNombre: 'Ocupación de vía pública',
      solicitanteId: 'u-diego-fuentes',
      solicitanteNombre: 'Diego Alonso Fuentes',
      estado: EstadoSolicitud.RECIBIDO,
      datosFormulario: {},
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-09-18',
      fechaActualizacion: '2026-09-18'
    },
    {
      id: 'sol-7',
      folio: 'SOL-2026-000129',
      tipoPermisoId: 'patente',
      tipoPermisoNombre: 'Patente comercial',
      solicitanteId: 'u-camila-contreras',
      solicitanteNombre: 'Camila Paz Contreras',
      estado: EstadoSolicitud.EN_REVISION,
      datosFormulario: { direccion: 'Camino La Vinilla 88' },
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-09-19',
      fechaActualizacion: '2026-09-20'
    },
    {
      id: 'sol-8',
      folio: 'SOL-2026-000130',
      tipoPermisoId: 'patente',
      tipoPermisoNombre: 'Patente comercial',
      solicitanteId: 'u-ciudadano-01',
      solicitanteNombre: 'Jerry Joaquin Quiroga Ortega',
      estado: EstadoSolicitud.CERRADO,
      datosFormulario: {
        nombreComercial: 'Cafetería Raíces',
        direccion: 'Av. Providencia 1200',
      },
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-07-02',
      fechaActualizacion: '2026-07-18',
      fechaEmision: '2026-07-18',
    },
    {
      id: 'sol-9',
      folio: 'SOL-2026-000131',
      tipoPermisoId: 'patente',
      tipoPermisoNombre: 'Patente comercial',
      solicitanteId: 'u-ciudadano-01',
      solicitanteNombre: 'Jerry Joaquin Quiroga Ortega',
      estado: EstadoSolicitud.EN_REVISION,
      datosFormulario: {
        nombreComercial: 'Almacén La Esquina',
        direccion: 'Calle Los Aromos 455',
      },
      documentos: [],
      observaciones: [],
      fechaCreacion: '2026-09-21',
      fechaActualizacion: '2026-09-23',
    }
  ]);

  constructor(
    private readonly auth: AuthService,
    private readonly permisos: PermisosService
  ) {}

  // El segundo argumento es opcional para conservar las llamadas del flujo por pasos.
  iniciarSolicitud(
    tipoPermisoId: string,
    datosFormulario: Record<string, unknown> = {}
  ): Observable<Solicitud> {
    const usuario = this.auth.usuarioActual;
    if (!usuario) {
      return throwError(() => new Error('Debes iniciar sesión para solicitar un trámite.'));
    }

    return this.permisos.listar(true).pipe(
      take(1),
      switchMap((tipos) => {
        const tipo = tipos.find((item) => item.id === tipoPermisoId);
        if (!tipo) {
          return throwError(() => new Error('Selecciona un permiso activo del catálogo.'));
        }
        const fecha = new Date();
        const solicitud: Solicitud = {
          id: crypto.randomUUID(),
          folio: `SOL-${fecha.getFullYear()}-${String(this.siguienteFolio()).padStart(6, '0')}`,
          tipoPermisoId: tipo.id,
          tipoPermisoNombre: tipo.nombre,
          solicitanteId: usuario.id,
          solicitanteNombre: usuario.nombre,
          estado: EstadoSolicitud.RECIBIDO,
          datosFormulario: { ...datosFormulario },
          documentos: [],
          observaciones: [],
          fechaCreacion: fecha.toISOString(),
          fechaActualizacion: fecha.toISOString()
        };
        this.datos.next([...this.datos.value, solicitud]);
        return of(solicitud);
      })
    );
  }

  avanzarPaso(d: AvanzarPasoDto): Observable<Solicitud> {
    return this.cambiar(d.solicitudId, (s) => ({
      ...s,
      datosFormulario: { ...s.datosFormulario, ...d.datos },
      estado: d.paso === 3 ? EstadoSolicitud.EN_REVISION : s.estado
    }));
  }

  adjuntarDocumento(
    id: string,
    requisitoId: string,
    archivo: File
  ): Observable<Solicitud> {
    return this.cambiar(id, (s) => ({
      ...s,
      documentos: [
        ...s.documentos,
        {
          id: crypto.randomUUID(),
          requisitoId,
          nombreArchivo: archivo.name,
          urlSimulada: '#',
          fechaCarga: new Date().toISOString()
        }
      ]
    }));
  }

  pagarSimulado(id: string): Observable<ComprobantePago> {
    const p = {
      id: crypto.randomUUID(),
      monto: 25000,
      fecha: new Date().toISOString(),
      numeroTransaccionSimulado: 'TX-' + Date.now()
    };

    this.cambiar(id, (s) => ({ ...s, comprobantePago: p })).subscribe();
    return of(p);
  }

  misSolicitudes(
    solicitanteId: string,
    filtro: FiltroSolicitudes = {}
  ): Observable<Solicitud[]> {
    return this.datos.pipe(
      map((solicitudes) => this.filtrar(
        solicitudes.filter((solicitud) => solicitud.solicitanteId === solicitanteId),
        filtro
      ))
    );
  }

  listarTodas(
    _: FiltroSolicitudes | undefined = undefined
  ): Observable<Solicitud[]> {
    return this.datos.asObservable();
  }

  obtener(id: string): Observable<Solicitud> {
    return this.datos.pipe(map((x) => x.find((s) => s.id === id)!));
  }

  descargarComprobante(_: string): Observable<Blob> {
    return of(new Blob(['Comprobante simulado']));
  }

  resolver(d: ResolverSolicitudDto): Observable<Solicitud> {
    const e =
      d.accion === 'APROBAR'
        ? EstadoSolicitud.RESUELTO
        : d.accion === 'RECHAZAR'
        ? EstadoSolicitud.RECHAZADO
        : d.accion === 'EMITIR'
        ? EstadoSolicitud.CERRADO
        : EstadoSolicitud.EN_PROCESO;

    return this.cambiar(d.solicitudId, (s) => ({ ...s, estado: e }));
  }

  estadisticas(): Observable<{
    porEstado: Record<string, number>;
    porTipo: Record<string, number>;
  }> {
    return this.datos.pipe(
      map((a) => ({
        porEstado: a.reduce(
          (r, s) => ({ ...r, [s.estado]: (r[s.estado] ?? 0) + 1 }),
          {} as Record<string, number>
        ),
        porTipo: a.reduce(
          (r, s) => ({
            ...r,
            [s.tipoPermisoNombre]: (r[s.tipoPermisoNombre] ?? 0) + 1
          }),
          {} as Record<string, number>
        )
      }))
    );
  }

  private cambiar(
    id: string,
    fn: (s: Solicitud) => Solicitud
  ): Observable<Solicitud> {
    const n = fn(this.datos.value.find((s) => s.id === id)!);
    this.datos.next(this.datos.value.map((s) => (s.id === id ? n : s)));
    return of(n);
  }

  private siguienteFolio(): number {
    return this.datos.value.reduce((maximo, solicitud) => {
      const numero = Number(solicitud.folio.slice(-6));
      return Number.isFinite(numero) ? Math.max(maximo, numero) : maximo;
    }, 0) + 1;
  }

  private filtrar(solicitudes: Solicitud[], filtro: FiltroSolicitudes): Solicitud[] {
    const texto = filtro.texto?.trim().toLocaleLowerCase();
    return solicitudes.filter((solicitud) =>
      (!filtro.estado || solicitud.estado === filtro.estado) &&
      (!filtro.tipoPermisoId || solicitud.tipoPermisoId === filtro.tipoPermisoId) &&
      (!texto || `${solicitud.folio} ${solicitud.tipoPermisoNombre} ${solicitud.solicitanteNombre ?? ''}`
        .toLocaleLowerCase().includes(texto)) &&
      (!filtro.desde || solicitud.fechaCreacion >= filtro.desde) &&
      (!filtro.hasta || solicitud.fechaCreacion <= filtro.hasta)
    );
  }
}
