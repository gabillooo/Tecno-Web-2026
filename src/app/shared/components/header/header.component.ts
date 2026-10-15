import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { RolUsuario } from '../../../core/enums/estado-solicitud.enum';
import { EnlaceNavegacion } from '../../../core/models/navegacion.model';
import { Usuario } from '../../../core/models/usuario.model';

// El flujo del ciudadano aún no tiene páginas, por eso no hay enlaces definidos.
const ENLACES_CIUDADANO: EnlaceNavegacion[] = [];

const ENLACES_ADMINISTRADOR: EnlaceNavegacion[] = [
  { etiqueta: 'Inicio', ruta: '/admin', icono: 'home', exacto: true },
  { etiqueta: 'Solicitudes', ruta: '/admin/solicitudes', icono: 'inbox' },
  { etiqueta: 'Catálogo', ruta: '/admin/catalogo', icono: 'menu_book' },
  { etiqueta: 'Estadísticas', ruta: '/admin/estadisticas', icono: 'bar_chart' },
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() subtitulo: string = 'ADMINISTRACIÓN DE PERMISOS';

  // Se consumen con el async pipe en la plantilla: Angular se suscribe
  // y se desuscribe solo al destruir el componente.
  enlaces$: Observable<EnlaceNavegacion[]>;
  usuario$: Observable<Usuario | null>;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.usuario$ = this.authService.usuario$;
    this.enlaces$ = this.usuario$.pipe(
      map((usuario) => this.obtenerEnlaces(usuario?.rol ?? null))
    );
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }

  private obtenerEnlaces(rol: RolUsuario | null): EnlaceNavegacion[] {
    switch (rol) {
      case RolUsuario.CIUDADANO:
        return ENLACES_CIUDADANO;
      case RolUsuario.ADMINISTRADOR:
        return ENLACES_ADMINISTRADOR;
      default:
        return [];
    }
  }
}
