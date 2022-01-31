import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeConfigComponent } from './tree-config.component';

describe('TreeConfigComponent', () => {
  let component: TreeConfigComponent;
  let fixture: ComponentFixture<TreeConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
