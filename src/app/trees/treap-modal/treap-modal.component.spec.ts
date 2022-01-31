import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreapModalComponent } from './treap-modal.component';

describe('TreapModalComponent', () => {
  let component: TreapModalComponent;
  let fixture: ComponentFixture<TreapModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreapModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
