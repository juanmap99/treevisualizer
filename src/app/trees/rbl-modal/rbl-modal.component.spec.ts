import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RBLModalComponent } from './rbl-modal.component';

describe('RBLModalComponent', () => {
  let component: RBLModalComponent;
  let fixture: ComponentFixture<RBLModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RBLModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RBLModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
