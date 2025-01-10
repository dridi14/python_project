import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SpotifyService } from '../../services/spotify.service';
import { MenuComponent } from '../../menu/menu.component';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-top-tracks-popularity',
  standalone: true,
  templateUrl: './top-tracks-popularity.component.html',
  styleUrls: ['./top-tracks-popularity.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule, MenuComponent],
  providers: [SpotifyService],
})
export class TopTracksPopularityComponent extends BaseComponent implements OnInit {
  tracks: any[] = [];
  displayedTracks: any[] = [];
  currentTrackIndex: number = 0;

  constructor(private router: Router, private spotifyService: SpotifyService) {
    super();
  }

  ngOnInit(): void {
    this.spotifyService.getFilteredData({ top: 'true', top_column: 'popularity', top_n: '5' }).subscribe(
      (data: any) => {
        this.tracks = data;
        if (this.tracks.length > 0) {
          this.displayedTracks = [this.tracks[0]];
        }
      },
      (error) => {
        console.error('Error fetching top tracks:', error);
      }
    );
  }

  navigateToNextPage(): void {
    this.router.navigate(['/yearly-trends']);
  }

  navigateToPreviousPage(): void {
    this.router.navigate(['/']);
  }

  override navigate(direction: 'up' | 'down') {
    if (direction === 'down') {
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
        this.displayedTracks = [this.tracks[this.currentTrackIndex]];
      } else if (this.currentTrackIndex === this.tracks.length - 1) {
        this.navigateToNextPage();
      }
    } else {
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
        this.displayedTracks = [this.tracks[this.currentTrackIndex]];
      } else {
        this.navigateToPreviousPage();
      }
    }
  }
}
