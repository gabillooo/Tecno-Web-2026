import { RolUsuario } from '../enums/estado-solicitud.enum';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rut?: string;
  telefono?: string;
  direccion?: string;
  rol: RolUsuario;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegistroDto {
  nombre: string;
  email: string;
  rut: string;
  telefono?: string;
  password: string;
}

export interface ActualizarPerfilDto {
  nombre: string;
  telefono?: string;
  direccion?: string;
}

export interface SesionDto {
  token: string;
  usuario: Usuario;
}
