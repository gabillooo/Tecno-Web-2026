import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  cargando = false;
  error = '';

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    documento: ['', [Validators.required]],          // CI / RUT
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordsIguales });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  passwordsIguales(c: AbstractControl) {
    return c.get('password')?.value === c.get('confirmPassword')?.value
      ? null : { noCoinciden: true };
  }

  registrar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.cargando = true;
    this.error = '';

    const { nombre, documento, email, telefono, password } = this.form.getRawValue();
    this.auth.register({ nombre, rut: documento, email, telefono, password }).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/auth/login']);
      },
      error: (e) => {
        this.error = e?.error?.message || e?.message || 'No se pudo completar el registro';
        this.cargando = false;
      }
    });
  }
}
