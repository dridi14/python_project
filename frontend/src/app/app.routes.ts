import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ForceGraphComponent } from './force-graph/force-graph.component';
import { SpotifyTrackerComponent } from './spotify-tracker/spotify-tracker.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TopTracksPopularityComponent } from './sections/top-tracks-popularity/top-tracks-popularity.component';
import { YearlyTrendsComponent } from './sections/yearly-trends/yearly-trends.component';
import { TrackCharacteristicsComponent } from './sections/track-characteristics/track-characteristics.component';
import { SpotifyUsageInsightsComponent } from './sections/spotify-usage-insights/spotify-usage-insights.component';
import { FavoriteGenresContentComponent } from './sections/favorite-genres-content/favorite-genres-content.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'top-tracks-popularity', component: TopTracksPopularityComponent },
  { path: 'yearly-trends', component: YearlyTrendsComponent },
  { path: 'track-characteristics', component: TrackCharacteristicsComponent },
  { path: 'spotify-usage-insights', component: SpotifyUsageInsightsComponent },
  { path: 'favorite-genres', component: FavoriteGenresContentComponent },
  { path: 'track', component: SpotifyTrackerComponent },
  { path: 'graphs', component: ForceGraphComponent },

];
