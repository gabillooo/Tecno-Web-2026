import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTipoPermisoComponent } from './editar-tipo-permiso.component';

describe('EditarTipoPermisoComponent', () => {
  let component: EditarTipoPermisoComponent;
  let fixture: ComponentFixture<EditarTipoPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarTipoPermisoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarTipoPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
