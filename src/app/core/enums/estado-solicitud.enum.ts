/**
 * Estados posibles de una solicitud de permiso/licencia/patente.
 * Cada estado tiene una etiqueta visible y un color de chip (ver
 * ESTADO_SOLICITUD_LABEL y ESTADO_SOLICITUD_COLOR más abajo).
 */
export enum EstadoSolicitud {
  RECIBIDO = 'RECIBIDO',                 // La solicitud fue ingresada
  EN_REVISION = 'EN_REVISION',           // Pendiente de revisión por un administrador
  EN_PROCESO = 'EN_PROCESO',             // El trámite está siendo gestionado
  RESUELTO = 'RESUELTO',                 // Resuelto favorablemente
  RECHAZADO = 'RECHAZADO',               // Rechazado definitivamente
  CERRADO = 'CERRADO',                   // Trámite finalizado
  PAGADO = 'PAGADO',                     // Pago realizado
  PENDIENTE_PAGO = 'PENDIENTE_PAGO',     // A la espera del pago
  VENCIDO = 'VENCIDO',                   // Plazo vencido
  EN_CONVENIO = 'EN_CONVENIO',           // Pago acordado mediante convenio
  DISPONIBLE = 'DISPONIBLE',             // Documento disponible para el ciudadano
  NO_DISPONIBLE = 'NO_DISPONIBLE',       // Documento aún no disponible
}

/** Texto visible de cada estado */
export const ESTADO_SOLICITUD_LABEL: Record<EstadoSolicitud, string> = {
  [EstadoSolicitud.RECIBIDO]: 'Recibido',
  [EstadoSolicitud.EN_REVISION]: 'En revisión',
  [EstadoSolicitud.EN_PROCESO]: 'En proceso',
  [EstadoSolicitud.RESUELTO]: 'Resuelto',
  [EstadoSolicitud.RECHAZADO]: 'Rechazado',
  [EstadoSolicitud.CERRADO]: 'Cerrado',
  [EstadoSolicitud.PAGADO]: 'Pagado',
  [EstadoSolicitud.PENDIENTE_PAGO]: 'Pendiente de pago',
  [EstadoSolicitud.VENCIDO]: 'Vencido',
  [EstadoSolicitud.EN_CONVENIO]: 'En convenio',
  [EstadoSolicitud.DISPONIBLE]: 'Disponible',
  [EstadoSolicitud.NO_DISPONIBLE]: 'No disponible',
};

/** Color de la pill: sufijo de la clase CSS "pill--<color>" (styles.css) */
export type ColorChip = 'cian' | 'amarillo' | 'verde' | 'rojo' | 'gris';

export const ESTADO_SOLICITUD_COLOR: Record<EstadoSolicitud, ColorChip> = {
  [EstadoSolicitud.RECIBIDO]: 'cian',
  [EstadoSolicitud.EN_REVISION]: 'cian',
  [EstadoSolicitud.EN_PROCESO]: 'amarillo',
  [EstadoSolicitud.RESUELTO]: 'verde',
  [EstadoSolicitud.RECHAZADO]: 'rojo',
  [EstadoSolicitud.CERRADO]: 'gris',
  [EstadoSolicitud.PAGADO]: 'verde',
  [EstadoSolicitud.PENDIENTE_PAGO]: 'amarillo',
  [EstadoSolicitud.VENCIDO]: 'rojo',
  [EstadoSolicitud.EN_CONVENIO]: 'cian',
  [EstadoSolicitud.DISPONIBLE]: 'verde',
  [EstadoSolicitud.NO_DISPONIBLE]: 'gris',
};

export enum TipoPermisoCategoria {
  PATENTE_COMERCIAL = 'PATENTE_COMERCIAL',
  PERMISO_CIRCULACION = 'PERMISO_CIRCULACION',
  PERMISO_CONSTRUCCION_MENOR = 'PERMISO_CONSTRUCCION_MENOR',
  AUTORIZACION_EVENTO = 'AUTORIZACION_EVENTO',
  OCUPACION_VIA_PUBLICA = 'OCUPACION_VIA_PUBLICA',
  OTRO = 'OTRO',
}

export enum RolUsuario {
  CIUDADANO = 'CIUDADANO',
  ADMINISTRADOR = 'ADMINISTRADOR',
}
