import { Component, OnInit, HostListener } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Chart, registerables } from 'chart.js';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'app-favorite-genres-content',
  standalone: true,
  templateUrl: './favorite-genres-content.component.html',
  styleUrls: ['./favorite-genres-content.component.css'],
  providers: [SpotifyService],
  imports: [RouterModule, CommonModule, HttpClientModule, MenuComponent],
})
export class FavoriteGenresContentComponent implements OnInit {
  chart!: Chart;
  genres: any[] = [];
  colors: string[] = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#E7E9ED', '#8A2BE2', '#5F9EA0', '#FFD700',
  ];

  constructor(private spotifyService: SpotifyService, private router: Router) {
    Chart.register(...registerables);
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      // Scroll down
    } else if (event.deltaY < 0) {
      this.router.navigate(['/spotify-usage-insights']);
    }
  }

  ngOnInit(): void {
    this.fetchGenresByDemographics();
  }

  fetchGenresByDemographics(): void {
    this.spotifyService.getFavoriteGenres().subscribe(
      (data: any) => {
        this.genres = data;
        this.createCombinedChart();
      },
      (error) => {
        console.error('Error fetching genres:', error);
      }
    );
  }

  createCombinedChart(): void {
    const ctx = document.getElementById('combinedChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element not found.');
      return;
    }

    const labels = [...new Set(this.genres.map((item: any) => item.fav_music_genre))];
    const maleData = labels.map((genre) =>
      this.genres
        .filter((item: any) => item.Gender === 'Male' && item.fav_music_genre === genre)
        .reduce((sum: number, item: any) => sum + item.count, 0)
    );
    const femaleData = labels.map((genre) =>
      this.genres
        .filter((item: any) => item.Gender === 'Female' && item.fav_music_genre === genre)
        .reduce((sum: number, item: any) => sum + item.count, 0)
    );

    const backgroundColors = labels.map((_, index) => this.colors[index % this.colors.length]);

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.flatMap((genre) => [`${genre} (Male)`, `${genre} (Female)`]),
        datasets: [
          {
            data: labels.flatMap((_, i) => [maleData[i], femaleData[i]]),
            backgroundColor: labels.flatMap((_, i) => [backgroundColors[i], backgroundColors[i]]),
            hoverBackgroundColor: labels.flatMap((_, i) => [backgroundColors[i], backgroundColors[i]]),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const total =
                  maleData[Math.floor(context.dataIndex / 2)] +
                  femaleData[Math.floor(context.dataIndex / 2)];
                const percentage = ((context.raw as number / total) * 100).toFixed(2);
                return `${context.label}: ${context.raw} (${percentage}%)`;
              },
            },
          },
        },
      },
    });
  }
}
