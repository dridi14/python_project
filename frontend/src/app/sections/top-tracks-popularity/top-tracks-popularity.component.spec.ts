import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTracksPopularityComponent } from './top-tracks-popularity.component';

describe('TopTracksPopularityComponent', () => {
  let component: TopTracksPopularityComponent;
  let fixture: ComponentFixture<TopTracksPopularityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopTracksPopularityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopTracksPopularityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
