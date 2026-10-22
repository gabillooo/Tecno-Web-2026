import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RolUsuario } from '../enums/estado-solicitud.enum';

@Injectable({ providedIn: 'root' })
export class homeRedirectGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.auth.usuarioActual) {
      const inicio = this.auth.usuarioActual.rol === RolUsuario.ADMINISTRADOR
        ? '/admin'
        : '/ciudadano';
      return this.router.createUrlTree([inicio]);
    }
    return this.router.createUrlTree(['/auth/login']);
  }
}
