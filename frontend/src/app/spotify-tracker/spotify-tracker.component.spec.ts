import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyTrackerComponent } from './spotify-tracker.component';

describe('SpotifyTrackerComponent', () => {
  let component: SpotifyTrackerComponent;
  let fixture: ComponentFixture<SpotifyTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotifyTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
