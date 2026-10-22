import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Usuario } from '../../../../core/models/usuario.model';

@Component({
  selector: 'app-perfil-ciudadano',
  templateUrl: './perfil-ciudadano.component.html',
  styleUrls: ['./perfil-ciudadano.component.css'],
})
export class PerfilCiudadanoComponent implements OnInit {
  usuario: Usuario | null = null;
  editando = false;
  guardando = false;
  mensajeExito = '';
  error = '';

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    telefono: [''],
    direccion: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.usuario = this.auth.usuarioActual;
    this.cargarFormulario();
  }

  iniciales(): string {
    return this.usuario?.nombre.split(' ').filter(Boolean).slice(0, 2)
      .map((parte) => parte[0].toUpperCase()).join('') ?? '';
  }

  editar(): void {
    this.editando = true;
    this.mensajeExito = '';
  }

  cancelar(): void {
    this.editando = false;
    this.error = '';
    this.cargarFormulario();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.error = '';

    this.auth.actualizarPerfil(this.form.getRawValue()).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
        this.guardando = false;
        this.editando = false;
        this.mensajeExito = 'Tus datos fueron actualizados correctamente.';
      },
      error: () => {
        this.guardando = false;
        this.error = 'No fue posible actualizar el perfil.';
      },
    });
  }

  private cargarFormulario(): void {
    if (!this.usuario) return;
    this.form.reset({
      nombre: this.usuario.nombre,
      telefono: this.usuario.telefono ?? '',
      direccion: this.usuario.direccion ?? '',
    });
  }
}
