import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  tiposDocumento = [
    { valor: 'cl', etiqueta: 'RUT chileno' },
    { valor: 'us', etiqueta: 'Documento de EE.UU.' }
  ];

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    tipoDocumento: ['cl'],
    documento: ['', [Validators.required, this.documentoValido.bind(this)]],
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

  documentoValido(control: AbstractControl): ValidationErrors | null {
    const valor = String(control.value ?? '').trim();
    if (!valor) return null; // required se encarga del campo vacío
    const tipo = control.parent?.get('tipoDocumento')?.value ?? 'cl';
    return (tipo === 'cl' ? this.esRutValido(valor) : this.esIdUsValido(valor))
      ? null : { documentoInvalido: true };
  }

  private esRutValido(valor: string): boolean {
    const limpio = valor.replace(/[.\s]/g, '').toUpperCase();
    const coincidencia = limpio.match(/^(\d{1,8})-?([0-9K])$/);
    if (!coincidencia) return false;
    const cuerpo = coincidencia[1];
    let suma = 0;
    let factor = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += Number(cuerpo[i]) * factor;
      factor = factor === 7 ? 2 : factor + 1;
    }
    const resto = 11 - (suma % 11);
    const verificador = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return coincidencia[2] === verificador;
  }

  private esIdUsValido(valor: string): boolean {
    // EE.UU. no tiene un formato nacional único: se valida el formato básico de
    // licencias/IDs estatales (3–20 caracteres alfanuméricos y separadores comunes).
    return /^[A-Za-z0-9][A-Za-z0-9 -]{1,18}[A-Za-z0-9]$/.test(valor);
  }

  actualizarValidacionDocumento(): void {
    this.form.controls.documento.updateValueAndValidity();
  }

  get ayudaDocumento(): string {
    return this.form.controls.tipoDocumento.value === 'cl'
      ? 'RUT con dígito verificador (ej.: 12.345.678-5).'
      : 'Licencia o identificación estatal, 3 a 20 caracteres. Se valida el formato.';
  }

  get errorDocumento(): string {
    return this.form.controls.tipoDocumento.value === 'cl'
      ? 'El RUT no es válido. Revisa el número y su dígito verificador.'
      : 'Ingresa un documento válido de 3 a 20 caracteres.';
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
