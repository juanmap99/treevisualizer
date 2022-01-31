import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AVLModalComponent } from './avl-modal.component';

describe('AVLModalComponent', () => {
  let component: AVLModalComponent;
  let fixture: ComponentFixture<AVLModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AVLModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AVLModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
