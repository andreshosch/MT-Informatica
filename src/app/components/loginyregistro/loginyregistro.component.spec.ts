import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginyregistroComponent } from './loginyregistro.component';

describe('LoginyregistroComponent', () => {
  let component: LoginyregistroComponent;
  let fixture: ComponentFixture<LoginyregistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginyregistroComponent]
    });
    fixture = TestBed.createComponent(LoginyregistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
