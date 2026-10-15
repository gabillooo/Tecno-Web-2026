/** Enlace del menú principal (header) */
export interface EnlaceNavegacion {
  etiqueta: string;
  ruta: string;
  icono: string;      // nombre del ícono de Material Symbols
  exacto?: boolean;   // true: solo se marca activo si la URL coincide exactamente
}
