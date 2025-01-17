import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForceGraphComponent } from './force-graph.component';

describe('ForceGraphComponent', () => {
  let component: ForceGraphComponent;
  let fixture: ComponentFixture<ForceGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForceGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForceGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
