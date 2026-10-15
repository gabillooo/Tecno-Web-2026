import { Component, ElementRef, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map, startWith } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Usuario } from '../../../core/models/usuario.model';

interface EnlaceNavbar {
  etiqueta: string;
  ruta?: string;
  proximamente?: boolean;                 // sistemas aún no construidos: van en gris
  activoSi?: (url: string) => boolean;    // cuándo se marca como sección actual
}

// El navbar lleva apartados del portal, no acciones.
const ENLACES: EnlaceNavbar[] = [
  { etiqueta: 'Inicio', ruta: '/admin', activoSi: (url) => url === '/admin' },
  { etiqueta: 'Permisos y patentes', ruta: '/admin/solicitudes', activoSi: (url) => url.startsWith('/admin/') },
];

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  readonly enlaces = ENLACES;
  menuAbierto = false;

  readonly usuario$: Observable<Usuario | null>;
  readonly url$: Observable<string>;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly host: ElementRef<HTMLElement>
  ) {
    this.usuario$ = this.auth.usuario$;
    this.url$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => this.limpiar(e.urlAfterRedirects)),
      startWith(this.limpiar(this.router.url))
    );
  }

  esActivo(enlace: EnlaceNavbar, url: string | null): boolean {
    return !!enlace.activoSi && enlace.activoSi(url ?? '');
  }

  iniciales(usuario: Usuario): string {
    return usuario.nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  }

  alternarMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarSesion(): void {
    this.menuAbierto = false;
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }

  @HostListener('document:click', ['$event'])
  cerrarAlHacerClicFuera(evento: Event): void {
    if (this.menuAbierto && !this.host.nativeElement.contains(evento.target as Node)) {
      this.menuAbierto = false;
    }
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    this.menuAbierto = false;
  }

  private limpiar(url: string): string {
    return url.split('?')[0].split('#')[0];
  }
}