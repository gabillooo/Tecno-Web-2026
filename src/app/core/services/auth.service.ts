import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, delay, of, tap, throwError } from 'rxjs';
import {
  ActualizarPerfilDto,
  LoginDto,
  RegistroDto,
  SesionDto,
  Usuario,
} from '../models/usuario.model';
import { RolUsuario } from '../enums/estado-solicitud.enum';

const STORAGE_KEY = 'permisos_sesion';
const USUARIOS_KEY = 'permisos_usuarios';
const ADMIN_PROFILE_KEY = 'permisos_admin_perfil';
const DEMO_CIUDADANO_VERSION_KEY = 'permisos_demo_ciudadano_v1';
const ADMIN_EMAIL = 'admin@municipal.cl';

interface UsuarioRegistrado extends Usuario {
  password: string;
}

const DEMO_CIUDADANO: UsuarioRegistrado = {
  id: 'u-ciudadano-01',
  nombre: 'Jerry Joaquin Quiroga Ortega',
  email: 'jerrykairox@gmail.com',
  rut: '21.957.582-3',
  rol: RolUsuario.CIUDADANO,
  password: '1234',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioSubject = new BehaviorSubject<Usuario | null>(
    this.leer()?.usuario ?? null
  );

  readonly usuario$ = this.usuarioSubject.asObservable();

  login(dto: LoginDto): Observable<SesionDto> {
    const email = dto.email.trim().toLowerCase();
    let sesion: SesionDto | null = null;

    if (email === ADMIN_EMAIL && dto.password === '1234') {
      sesion = {
        token: 'demo-token-2026',
        usuario: this.leerPerfilAdmin(),
      };
    } else {
      const encontrado = this.leerUsuarios().find(
        (u) => u.email === email && u.password === dto.password
      );
      if (encontrado) {
        const { password, ...usuario } = encontrado;
        sesion = { token: `demo-token-${usuario.id}`, usuario };
      }
    }

    if (!sesion) {
      return throwError(() => new Error('Credenciales inválidas'));
    }

    return of(sesion).pipe(
      delay(350),
      tap((value) => this.guardar(value))
    );
  }

  register(dto: RegistroDto): Observable<Usuario> {
    const email = dto.email.trim().toLowerCase();
    const rut = dto.rut.trim();
    const usuarios = this.leerUsuarios();

    if (email === ADMIN_EMAIL || usuarios.some((u) => u.email === email)) {
      return throwError(
        () => new Error('Ya existe una cuenta con ese correo')
      );
    }
    if (usuarios.some((u) => u.rut === rut)) {
      return throwError(() => new Error('Ya existe una cuenta con ese RUT'));
    }

    const nuevo: UsuarioRegistrado = {
      id: `u-${Date.now()}`,
      nombre: dto.nombre.trim(),
      email,
      rut,
      telefono: dto.telefono?.trim(),
      rol: RolUsuario.CIUDADANO, // el rol se fija aquí, no viene del formulario
      password: dto.password,
    };

    usuarios.push(nuevo);
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));

    const { password, ...usuario } = nuevo;
    return of(usuario).pipe(delay(350));
  }

  perfil(): Promise<Usuario | null> {
    return Promise.resolve(this.usuarioActual);
  }

  actualizarPerfil(dto: ActualizarPerfilDto): Observable<Usuario> {
    const actual = this.usuarioActual;

    if (!actual) {
      return throwError(() => new Error('No hay una sesión activa'));
    }

    const usuario: Usuario = {
      ...actual,
      nombre: dto.nombre.trim(),
      telefono: dto.telefono?.trim() || undefined,
      direccion: dto.direccion?.trim() || undefined,
    };

    if (usuario.rol === RolUsuario.ADMINISTRADOR) {
      localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(usuario));
    } else {
      const usuarios = this.leerUsuarios().map((item) =>
        item.id === usuario.id ? { ...item, ...usuario } : item
      );
      localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
    }

    const sesion = this.leer();
    if (sesion) {
      this.guardar({ ...sesion, usuario });
    } else {
      this.usuarioSubject.next(usuario);
    }

    return of(usuario).pipe(delay(300));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.usuarioSubject.next(null);
  }

  get usuarioActual(): Usuario | null {
    return this.usuarioSubject.value;
  }

  get token(): string | null {
    return this.leer()?.token ?? null;
  }

  esRol(rol: RolUsuario): boolean {
    return this.usuarioActual?.rol === rol;
  }

  private guardar(sesion: SesionDto): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));
    this.usuarioSubject.next(sesion.usuario);
  }

  private leer(): SesionDto | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const sesion = raw ? (JSON.parse(raw) as SesionDto) : null;
      if (
        sesion?.usuario?.id === DEMO_CIUDADANO.id ||
        sesion?.usuario?.email === 'ciudadano@municipal.cl'
      ) {
        sesion.usuario = {
          ...sesion.usuario,
          nombre: DEMO_CIUDADANO.nombre,
          email: DEMO_CIUDADANO.email,
          rut: DEMO_CIUDADANO.rut,
          rol: DEMO_CIUDADANO.rol,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));
      }
      return sesion;
    } catch {
      return null;
    }
  }

  private leerUsuarios(): UsuarioRegistrado[] {
    try {
      const raw = localStorage.getItem(USUARIOS_KEY);
      const usuarios = raw ? (JSON.parse(raw) as UsuarioRegistrado[]) : [];

      if (localStorage.getItem(DEMO_CIUDADANO_VERSION_KEY) !== '1') {
        const indiceDemo = usuarios.findIndex(
          (usuario) =>
            usuario.id === DEMO_CIUDADANO.id ||
            usuario.email === DEMO_CIUDADANO.email ||
            usuario.email === 'ciudadano@municipal.cl'
        );
        if (indiceDemo === -1) {
          usuarios.push({ ...DEMO_CIUDADANO });
        } else {
          usuarios[indiceDemo] = { ...usuarios[indiceDemo], ...DEMO_CIUDADANO };
        }
        localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
        localStorage.setItem(DEMO_CIUDADANO_VERSION_KEY, '1');
      }

      return usuarios;
    } catch {
      return [];
    }
  }

  private leerPerfilAdmin(): Usuario {
    try {
      const raw = localStorage.getItem(ADMIN_PROFILE_KEY);
      if (raw) {
        return JSON.parse(raw) as Usuario;
      }
    } catch {
      // Se usa el perfil inicial si el almacenamiento local no es válido.
    }

    return {
      id: 'u-admin',
      nombre: 'Administrador municipal',
      email: ADMIN_EMAIL,
      telefono: '',
      direccion: '',
      rol: RolUsuario.ADMINISTRADOR,
    };
  }
}
