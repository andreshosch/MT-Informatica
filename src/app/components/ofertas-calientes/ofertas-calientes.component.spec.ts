import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasCalientesComponent } from './ofertas-calientes.component';

describe('OfertasCalientesComponent', () => {
  let component: OfertasCalientesComponent;
  let fixture: ComponentFixture<OfertasCalientesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfertasCalientesComponent]
    });
    fixture = TestBed.createComponent(OfertasCalientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
