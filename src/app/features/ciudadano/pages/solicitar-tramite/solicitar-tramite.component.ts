import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TipoPermiso } from '../../../../core/models/permiso.model';
import { Solicitud } from '../../../../core/models/solicitud.model';
import { AuthService } from '../../../../core/services/auth.service';
import { PermisosService } from '../../../../core/services/permisos.service';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';

@Component({
  selector: 'app-solicitar-tramite',
  templateUrl: './solicitar-tramite.component.html',
  styleUrls: ['./solicitar-tramite.component.css']
})
export class SolicitarTramiteComponent implements OnInit, OnDestroy {
  tipos: TipoPermiso[] = [];
  guardando = false;
  error = '';
  avisoPermiso = '';
  creada: Solicitud | null = null;
  private readonly suscripciones = new Subscription();

  readonly form = this.fb.nonNullable.group({
    tipoPermisoId: ['', Validators.required],
    motivo: ['', [Validators.required, Validators.pattern(/\S/)]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    public readonly auth: AuthService,
    private readonly permisos: PermisosService,
    private readonly solicitudes: SolicitudesService
  ) {}

  ngOnInit(): void {
    this.suscripciones.add(this.permisos.listar(true).subscribe((tipos) => {
      this.tipos = tipos;
      const seleccionado = this.form.controls.tipoPermisoId;
      if (seleccionado.value && !tipos.some((tipo) => tipo.id === seleccionado.value)) {
        seleccionado.setValue('');
        this.avisoPermiso = 'El permiso seleccionado ya no está disponible. Selecciona otro.';
      }
    }));
    this.suscripciones.add(this.route.paramMap.subscribe((parametros) => {
      const id = parametros.get('permisoId') ?? '';
      const disponible = this.tipos.some((tipo) => tipo.id === id);
      this.form.controls.tipoPermisoId.setValue(disponible ? id : '');
      this.avisoPermiso = !id || disponible ? '' : 'El permiso de esta dirección no está disponible. Selecciona un permiso activo.';
    }));
  }

  enviar(): void {
    if (this.guardando || this.creada) return;
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const valor = this.form.getRawValue();
    if (!this.tipos.some((tipo) => tipo.id === valor.tipoPermisoId)) {
      this.error = 'Selecciona un permiso activo del catálogo.';
      return;
    }
    this.guardando = true;
    this.solicitudes.iniciarSolicitud(valor.tipoPermisoId, {
      motivo: valor.motivo.trim()
    }).subscribe({
      next: (solicitud) => {
        this.creada = solicitud;
        this.guardando = false;
      },
      error: (error: Error) => {
        this.error = error.message || 'No se pudo registrar la solicitud. Intenta nuevamente.';
        this.guardando = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
  }
}
