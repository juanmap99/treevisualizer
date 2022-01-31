import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BSTModalComponent } from './bst-modal.component';

describe('BSTModalComponent', () => {
  let component: BSTModalComponent;
  let fixture: ComponentFixture<BSTModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BSTModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BSTModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
