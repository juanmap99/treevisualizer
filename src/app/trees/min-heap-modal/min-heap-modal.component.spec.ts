import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinHeapModalComponent } from './min-heap-modal.component';

describe('MinHeapModalComponent', () => {
  let component: MinHeapModalComponent;
  let fixture: ComponentFixture<MinHeapModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinHeapModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MinHeapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
