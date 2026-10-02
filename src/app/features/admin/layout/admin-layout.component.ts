import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
})
export class AdminLayoutComponent {
  constructor(public readonly auth: AuthService, private readonly router: Router) {}

  salir(): void {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
