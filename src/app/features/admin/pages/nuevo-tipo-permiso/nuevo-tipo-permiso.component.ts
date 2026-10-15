import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
 * Alta de un nuevo tipo de permiso del catálogo:
 * nombre, categoría, descripción, tarifa, plazo, estado y requisitos.
 */
@Component({
  selector: 'app-nuevo-tipo-permiso',
  templateUrl: './nuevo-tipo-permiso.component.html',
  styleUrls: ['./nuevo-tipo-permiso.component.css'],
})
export class NuevoTipoPermisoComponent {
  readonly categorias = Object.values(TipoPermisoCategoria);

  guardando = false;
  errorMensaje: string | null = null;
  /** Tipo recién creado: al tener valor se muestra la confirmación en lugar del formulario. */
  creado: TipoPermiso | null = null;

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
    private readonly permisosService: PermisosService,
    private readonly fb: FormBuilder
  ) {}

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

    this.permisosService.crear(dto).subscribe({
      next: (nuevo) => {
        this.guardando = false;
        this.creado = nuevo;
      },
      error: () => {
        this.guardando = false;
        this.errorMensaje = 'No se pudo guardar el tipo de permiso. Intenta nuevamente.';
      },
    });
  }

  /** Vuelve al formulario en blanco para crear otro tipo de permiso. */
  crearOtro(): void {
    this.creado = null;
    this.errorMensaje = null;
    this.form.reset({
      nombre: '',
      categoria: this.categorias[0],
      descripcion: '',
      tarifa: 0,
      plazoEstimadoDias: 1,
      activo: true,
    });
    this.requisitos.clear();
    this.requisitos.push(this.nuevoRequisito());
  }

  private nuevoRequisito() {
    return this.fb.nonNullable.group({
      descripcion: ['', Validators.required],
      obligatorio: [true],
    });
  }
}
