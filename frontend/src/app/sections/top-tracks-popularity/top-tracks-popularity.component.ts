import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-top-tracks-popularity',
  standalone: true,
  templateUrl: './top-tracks-popularity.component.html',
  styleUrls: ['./top-tracks-popularity.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule], // Include HttpClientModule
  providers: [SpotifyService], // Add the service as a provider
})
export class TopTracksPopularityComponent implements OnInit {
  tracks: any[] = [];
  displayedTracks: any[] = [];
  currentTrackIndex: number = 0;
  lastScrollTime: number = 0;

  constructor(private router: Router, private spotifyService: SpotifyService) {}

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

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (Date.now() - this.lastScrollTime < 1000) return;
    this.lastScrollTime = Date.now();
    if (event.deltaY > 0) {
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
        this.displayedTracks = [this.tracks[this.currentTrackIndex]];
      } else if (this.currentTrackIndex === this.tracks.length - 1) {
        this.navigateToNextPage();
      }
    } else if (event.deltaY < 0) {
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
        this.displayedTracks = [this.tracks[this.currentTrackIndex]];
      } else {
        this.navigateToPreviousPage();
      }
    }
  }
}
