import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxHeapModalComponent } from './max-heap-modal.component';

describe('MaxHeapModalComponent', () => {
  let component: MaxHeapModalComponent;
  let fixture: ComponentFixture<MaxHeapModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaxHeapModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaxHeapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
