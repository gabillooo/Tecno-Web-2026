import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { SolicitarTramiteComponent } from './solicitar-tramite.component';
import { MisSolicitudesComponent } from '../solicitudes/mis-solicitudes.component';
import { SolicitudesComponent } from '../../../admin/pages/solicitudes/solicitudes.component';
import { EstadisticasComponent } from '../../../admin/pages/estadisticas/estadisticas.component';
import { SolicitudesService } from '../../../../core/services/solicitudes.service';
import { PermisosService } from '../../../../core/services/permisos.service';
import { AuthService } from '../../../../core/services/auth.service';
import { EstadoSolicitud, RolUsuario, TipoPermisoCategoria } from '../../../../core/enums/estado-solicitud.enum';
import { Solicitud } from '../../../../core/models/solicitud.model';

describe('Solicitud de trámite: integración con las tres secciones', () => {
  const auth = { usuarioActual: { id: 'cuenta-prueba', nombre: 'Cuenta de prueba', rol: RolUsuario.CIUDADANO } };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [SolicitarTramiteComponent, MisSolicitudesComponent, SolicitudesComponent, EstadisticasComponent],
      providers: [
        SolicitudesService, PermisosService,
        { provide: AuthService, useValue: auth },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ permisoId: 'patente' })) } }
      ]
    }).compileComponents();
  });

  it('valida, registra una sola vez y muestra el mismo registro en las tres vistas', () => {
    const permisos = TestBed.inject(PermisosService);
    const servicio = TestBed.inject(SolicitudesService);
    let nuevoId = '';
    permisos.crear({ nombre: 'Permiso de prueba', categoria: TipoPermisoCategoria.OTRO,
      descripcion: 'Prueba de catálogo dinámico', requisitos: [], tarifa: 0,
      plazoEstimadoDias: 1, activo: true }).subscribe((tipo) => nuevoId = tipo.id);
    const formulario = TestBed.createComponent(SolicitarTramiteComponent);
    formulario.detectChanges();
    const componente = formulario.componentInstance;
    expect(componente.form.controls.tipoPermisoId.value).toBe('patente');
    expect(formulario.nativeElement.textContent).toContain(auth.usuarioActual.nombre);
    expect(formulario.nativeElement.querySelector('input[type="file"]')).toBeNull();
    let todas: Solicitud[] = [];
    servicio.listarTodas().subscribe((items) => todas = items);
    const cantidadInicial = todas.length;
    const enviar = () => formulario.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    enviar();
    expect(todas.length).toBe(cantidadInicial);
    componente.form.controls.motivo.setValue('   ');
    enviar();
    expect(todas.length).toBe(cantidadInicial);

    const ciudadano = TestBed.createComponent(MisSolicitudesComponent);
    const admin = TestBed.createComponent(SolicitudesComponent);
    const estadisticas = TestBed.createComponent(EstadisticasComponent);
    ciudadano.detectChanges(); admin.detectChanges(); estadisticas.detectChanges();
    const select: HTMLSelectElement = formulario.nativeElement.querySelector('select');
    select.value = nuevoId;
    select.dispatchEvent(new Event('change'));
    const motivo: HTMLTextAreaElement = formulario.nativeElement.querySelector('textarea');
    motivo.value = '  Solicitud para actividad municipal  ';
    motivo.dispatchEvent(new Event('input'));
    enviar(); enviar();
    formulario.detectChanges(); ciudadano.detectChanges(); admin.detectChanges(); estadisticas.detectChanges();
    expect(todas.length).toBe(cantidadInicial + 1);
    const creada = componente.creada!;
    expect(creada.estado).toBe(EstadoSolicitud.RECIBIDO);
    expect(creada.solicitanteId).toBe(auth.usuarioActual.id);
    expect(creada.tipoPermisoNombre).toBe('Permiso de prueba');
    expect(creada.datosFormulario['motivo']).toBe('Solicitud para actividad municipal');
    expect(formulario.nativeElement.textContent).toContain(creada.folio);
    expect(ciudadano.nativeElement.textContent).toContain(creada.folio);
    expect(ciudadano.nativeElement.textContent).not.toContain('SOL-2026-000123');
    expect(admin.nativeElement.textContent).toContain(creada.folio);
    expect(estadisticas.nativeElement.textContent).toContain('Permiso de prueba');
    servicio.estadisticas().subscribe((stats) => {
      expect(stats.porTipo['Permiso de prueba']).toBe(1);
      expect(stats.porEstado[EstadoSolicitud.RECIBIDO]).toBe(2);
    });
    servicio.misSolicitudes('otra-cuenta').subscribe((items) => expect(items.length).toBe(0));
    admin.componentInstance.aprobar(creada.id);
    ciudadano.detectChanges();
    expect(ciudadano.nativeElement.textContent).toContain('Resuelto');
  });

  it('rechaza permisos inválidos y deja de ofrecer permisos desactivados', () => {
    const formulario = TestBed.createComponent(SolicitarTramiteComponent);
    formulario.detectChanges();
    const componente = formulario.componentInstance;
    TestBed.inject(PermisosService).cambiarEstadoActivo('patente', false).subscribe();
    expect(componente.form.controls.tipoPermisoId.value).toBe('');
    expect(componente.tipos.some((tipo) => tipo.id === 'patente')).toBeFalse();
    componente.form.setValue({ tipoPermisoId: 'inexistente', motivo: 'Motivo válido' });
    componente.enviar();
    expect(componente.creada).toBeNull();
    expect(componente.error).toContain('activo');
    TestBed.inject(SolicitudesService).iniciarSolicitud('inexistente').subscribe({
      next: () => fail('No debe crear una solicitud sin permiso válido'),
      error: (error: Error) => expect(error.message).toContain('activo')
    });
  });

  it('conserva el método anterior y el avance por pasos', () => {
    const servicio = TestBed.inject(SolicitudesService);
    servicio.iniciarSolicitud('evento').subscribe((solicitud) => {
      expect(solicitud.estado).toBe(EstadoSolicitud.RECIBIDO);
      servicio.avanzarPaso({ solicitudId: solicitud.id, paso: 3, datos: { motivo: 'Flujo anterior' } })
        .subscribe((actualizada) => expect(actualizada.estado).toBe(EstadoSolicitud.EN_REVISION));
    });
  });
});
