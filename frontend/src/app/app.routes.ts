import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ForceGraphComponent } from './force-graph/force-graph.component';
import { SpotifyTrackerComponent } from './spotify-tracker/spotify-tracker.component';

export const routes: Routes = [
  { path: '', component: SpotifyTrackerComponent },
  { path: 'graphs', component: ForceGraphComponent },

];
