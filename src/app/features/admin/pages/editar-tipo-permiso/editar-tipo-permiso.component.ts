import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { PermisosService } from '../../../../core/services/permisos.service';
import { TipoPermiso, TipoPermisoFormDto } from '../../../../core/models/permiso.model';
import { TipoPermisoCategoria } from '../../../../core/enums/estado-solicitud.enum';

const CATEGORIA_LABEL: Record<TipoPermisoCategoria, string> = {
  [TipoPermisoCategoria.PATENTE_COMERCIAL]: 'Patente comercial',
  [TipoPermisoCategoria.PERMISO_CIRCULACION]: 'Permiso de circulación',
  [TipoPermisoCategoria.PERMISO_CONSTRUCCION_MENOR]: 'Permiso de construcción menor',
  [TipoPermisoCategoria.AUTORIZACION_EVENTO]: 'Autorización de evento',
  [TipoPermisoCategoria.OCUPACION_VIA_PUBLICA]: 'Ocupación de vía pública',
  [TipoPermisoCategoria.OTRO]: 'Otro',
};

/**
 * Edición de un tipo de permiso del catálogo.
 * Mismo formulario que NuevoTipoPermisoComponent, pero precargado con los
 * datos del tipo cuyo id viene en la ruta (/admin/catalogo/:id/editar).
 */
@Component({
  selector: 'app-editar-tipo-permiso',
  templateUrl: './editar-tipo-permiso.component.html',
  styleUrls: ['./editar-tipo-permiso.component.css'],
})
export class EditarTipoPermisoComponent implements OnInit {
  readonly categorias = Object.values(TipoPermisoCategoria);

  guardando = false;
  noEncontrado = false;
  errorMensaje: string | null = null;
  /** Tipo recién actualizado: al tener valor se muestra la confirmación en lugar del formulario. */
  actualizado: TipoPermiso | null = null;

  private id = '';

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    categoria: [TipoPermisoCategoria.PATENTE_COMERCIAL as TipoPermisoCategoria, Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(300)]],
    tarifa: [0, [Validators.required, Validators.min(0)]],
    plazoEstimadoDias: [1, [Validators.required, Validators.min(1)]],
    activo: [true],
    requisitos: this.fb.nonNullable.array([this.nuevoRequisito()]),
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly permisosService: PermisosService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    // take(1): el servicio es un BehaviorSubject y volvería a emitir al guardar,
    // lo que pisaría lo que el administrador está escribiendo.
    this.permisosService
      .obtener(this.id)
      .pipe(take(1))
      .subscribe((tipo) => {
        // obtener() devuelve el primer tipo si el id no existe, por eso se compara.
        if (!tipo || tipo.id !== this.id) {
          this.noEncontrado = true;
          return;
        }
        this.cargarFormulario(tipo);
      });
  }

  get requisitos() {
    return this.form.controls.requisitos;
  }

  etiquetaCategoria(categoria: TipoPermisoCategoria): string {
    return CATEGORIA_LABEL[categoria] ?? categoria;
  }

  agregarRequisito(): void {
    this.requisitos.push(this.nuevoRequisito());
  }

  quitarRequisito(indice: number): void {
    this.requisitos.removeAt(indice);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    this.errorMensaje = null;

    const v = this.form.getRawValue();
    const dto: TipoPermisoFormDto = {
      nombre: v.nombre.trim(),
      categoria: v.categoria,
      descripcion: v.descripcion.trim(),
      requisitos: v.requisitos.map((r) => ({
        descripcion: r.descripcion.trim(),
        obligatorio: r.obligatorio,
      })),
      tarifa: Number(v.tarifa),
      plazoEstimadoDias: Number(v.plazoEstimadoDias),
      activo: v.activo,
    };

    this.permisosService.actualizar(this.id, dto).subscribe({
      next: (tipo) => {
        this.guardando = false;
        this.actualizado = tipo;
      },
      error: () => {
        this.guardando = false;
        this.errorMensaje = 'No se pudieron guardar los cambios. Intenta nuevamente.';
      },
    });
  }

  /** Vuelve al formulario (con lo último guardado) para seguir editando. */
  seguirEditando(): void {
    this.actualizado = null;
    this.errorMensaje = null;
  }

  private cargarFormulario(tipo: TipoPermiso): void {
    this.form.patchValue({
      nombre: tipo.nombre,
      categoria: tipo.categoria,
      descripcion: tipo.descripcion,
      tarifa: tipo.tarifa,
      plazoEstimadoDias: tipo.plazoEstimadoDias,
      activo: tipo.activo,
    });

    this.requisitos.clear();
    tipo.requisitos.forEach((r) =>
      this.requisitos.push(this.nuevoRequisito(r.descripcion, r.obligatorio))
    );
  }

  private nuevoRequisito(descripcion = '', obligatorio = true) {
    return this.fb.nonNullable.group({
      descripcion: [descripcion, Validators.required],
      obligatorio: [obligatorio],
    });
  }
}