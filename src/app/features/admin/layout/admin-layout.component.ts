import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, filter, map, startWith } from 'rxjs';

/**
 * Contenedor del área de administración: subnavegación de pestañas
 * (Solicitudes · Catálogo · Estadísticas) y la página activa debajo.
 * El navbar y el footer los dibuja AppComponent.
 */
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent {
  /** Las pestañas se ocultan en la portada del panel (/admin). */
  readonly mostrarPestanas$: Observable<boolean>;

  constructor(private readonly router: Router) {
    this.mostrarPestanas$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => this.esSubpagina(e.urlAfterRedirects)),
      startWith(this.esSubpagina(this.router.url))
    );
  }

  private esSubpagina(url: string): boolean {
    return url.split('?')[0].split('#')[0] !== '/admin';
  }
}
