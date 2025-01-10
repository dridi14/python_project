import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../../menu/menu.component';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-favorite-genres-content',
  standalone: true,
  templateUrl: './favorite-genres-content.component.html',
  styleUrls: ['./favorite-genres-content.component.css'],
  providers: [SpotifyService],
  imports: [RouterModule, CommonModule, HttpClientModule, MenuComponent, FormsModule],
})
export class FavoriteGenresContentComponent extends BaseComponent implements OnInit, OnDestroy {
  chart!: Chart;
  genres: any[] = [];
  filteredGenres: any[] = [];
  availableGenres: string[] = [];
  selectedGender: string = '';
  selectedGenre: string = '';
  colors: string[] = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#E7E9ED', '#8A2BE2', '#5F9EA0', '#FFD700',
  ];

  constructor(private spotifyService: SpotifyService, private router: Router) {
    Chart.register(...registerables);
    super();
  }

  override navigate(direction: 'up' | 'down') {
    if (direction === 'down') {
      this.router.navigate(['/spotify-usage-insights']);
    }
  }

  ngOnInit(): void {
    Chart.register(ChartDataLabels);
    this.fetchGenresByDemographics();
  }

  ngOnDestroy(): void {
    // remove plugin
    Chart.unregister(ChartDataLabels);
  }

  fetchGenresByDemographics(): void {
    this.spotifyService.getFavoriteGenres().subscribe(
      (data: any) => {
        this.genres = data;
        this.availableGenres = [...new Set(this.genres.map((item: any) => item.fav_music_genre))];
        this.filteredGenres = [...this.genres];
        this.createCombinedChart();
      },
      (error) => {
        console.error('Error fetching genres:', error);
      }
    );
  }

  applyFilters(): void {
    this.filteredGenres = this.genres.filter((item: any) => {
      const genderMatch = this.selectedGender ? item.Gender === this.selectedGender : true;
      const genreMatch = this.selectedGenre ? item.fav_music_genre === this.selectedGenre : true;
      return genderMatch && genreMatch;
    });
    this.createCombinedChart();
  }

  createCombinedChart(): void {
    const ctx = document.getElementById('combinedChart') as HTMLCanvasElement;

    if (!ctx) {
      console.error('Canvas element not found.');
      return;
    }

    const labels = [...new Set(this.filteredGenres.map((item: any) => item.fav_music_genre))];
    const maleData = labels.map((genre) =>
      this.filteredGenres
        .filter((item: any) => item.Gender === 'Male' && item.fav_music_genre === genre)
        .reduce((sum: number, item: any) => sum + item.count, 0)
    );
    const femaleData = labels.map((genre) =>
      this.filteredGenres
        .filter((item: any) => item.Gender === 'Female' && item.fav_music_genre === genre)
        .reduce((sum: number, item: any) => sum + item.count, 0)
    );

    const totalMaleCount = maleData.reduce((sum, count) => sum + count, 0);
    const totalFemaleCount = femaleData.reduce((sum, count) => sum + count, 0);

    const backgroundColors = labels.map((_, index) => this.colors[index % this.colors.length]);

    if (this.chart) {
      this.chart.destroy();
    }
    const includeMale = maleData.some((count) => count > 0);
    const includeFemale = femaleData.some((count) => count > 0);

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.flatMap((genre) => [
          ...(includeMale ? [`${genre} (Male)`] : []),
          ...(includeFemale ? [`${genre} (Female)`] : []),
        ]),
        datasets: [
          {
            data: labels.flatMap((_, i) => [
              ...(includeMale ? [maleData[i]] : []),
              ...(includeFemale ? [femaleData[i]] : []),
            ]),
            backgroundColor: labels.flatMap((_, i) => [
              ...(includeMale ? [backgroundColors[i]] : []),
              ...(includeFemale ? [backgroundColors[i]] : []),
            ]),
            hoverBackgroundColor: labels.flatMap((_, i) => [
              ...(includeMale ? [backgroundColors[i]] : []),
              ...(includeFemale ? [backgroundColors[i]] : []),
            ]),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                let total = 0;
                if (context.datasetIndex === 0) {
                  total = totalMaleCount + totalFemaleCount;
                } else {
                  total = context.dataIndex % 2 === 0 ? totalMaleCount : totalFemaleCount;
                }
                const percentage = ((context.raw as number / total) * 100).toFixed(2);
                return `${context.label}: ${context.raw} (${percentage}%)`;
              },
            },
          },
          legend: {
            display: false,
          },
          datalabels: {
            formatter: (value, context) => {
              let total = 0;
              if (context.datasetIndex === 0) {
                total = totalMaleCount + totalFemaleCount;
              } else {
                total = context.dataIndex % 2 === 0 ? totalMaleCount : totalFemaleCount;
              }
              const percentage = ((value / total) * 100).toFixed(1);

              // Skip labels for small segments
              if (Number(percentage) < 5) {
                return null;
              }
              return `${context.chart.data.labels?.[context.dataIndex]}\n${percentage}%`;
            },
            color: '#fff',
            font: {
              weight: 'bold',
              size: 10,
            },
            anchor: 'center',
            align: 'center',
            clamp: true,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }
}
