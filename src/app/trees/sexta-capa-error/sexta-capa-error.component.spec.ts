import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SextaCapaErrorComponent } from './sexta-capa-error.component';

describe('SextaCapaErrorComponent', () => {
  let component: SextaCapaErrorComponent;
  let fixture: ComponentFixture<SextaCapaErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SextaCapaErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SextaCapaErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
