import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackCharacteristicsComponent } from './track-characteristics.component';

describe('TrackCharacteristicsComponent', () => {
  let component: TrackCharacteristicsComponent;
  let fixture: ComponentFixture<TrackCharacteristicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackCharacteristicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
