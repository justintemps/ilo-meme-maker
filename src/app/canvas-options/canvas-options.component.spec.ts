import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasOptionsComponent } from './canvas-options.component';

describe('CanvasOptionsComponent', () => {
  let component: CanvasOptionsComponent;
  let fixture: ComponentFixture<CanvasOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
