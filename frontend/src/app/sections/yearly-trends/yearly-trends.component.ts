import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SpotifyService } from '../../services/spotify.service';
import { Chart, registerables } from 'chart.js';
import { Router, RouterModule } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { MenuComponent } from '../../menu/menu.component';
import { BaseComponent } from '../../base/base.component';


@Component({
  selector: 'app-yearly-trends',
  standalone: true,
  templateUrl: './yearly-trends.component.html',
  styleUrls: ['./yearly-trends.component.css'],
  imports: [CommonModule, HttpClientModule, RouterModule, MenuComponent],
  providers: [SpotifyService],
})
export class YearlyTrendsComponent extends BaseComponent implements OnInit {
  chart!: Chart;
  years: number[] = [];
  averagePopularity: number[] = [];
  mostPopularYear!: number;
  highestPopularity!: number;

  constructor(
      private spotifyService: SpotifyService,
      private router: Router,
      private viewportScroller: ViewportScroller) {
    Chart.register(...registerables);
    super();
  }

  override navigate(direction: 'up' | 'down') {
    if (direction === 'up') {
      this.router.navigate(['/top-tracks-popularity']);
    } else if (direction === 'down') {
      this.router.navigate(['/track-characteristics']);
    }
  }

  ngOnInit(): void {
    this.spotifyService.getPopularityTrends().subscribe(
      (data: any) => {
        this.years = data.map((item: any) => item.year);
        this.averagePopularity = data.map((item: any) => item.popularity.toFixed(2));

        // Find the year with the highest popularity
        const maxPopularity = Math.max(...this.averagePopularity);
        this.highestPopularity = maxPopularity;
        this.mostPopularYear = this.years[this.averagePopularity.indexOf(maxPopularity)];

        this.initializeChart();
      },
      (error) => {
        console.error('Error fetching yearly trends:', error);
      }
    );
  }

  initializeChart(): void {
    const ctx = document.getElementById('yearlyTrendsChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.years,
        datasets: [
          {
            label: 'Average Popularity',
            data: this.averagePopularity,
            borderColor: '#1db954',
            backgroundColor: 'rgba(29, 185, 84, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Popularity: ${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            title: { display: true, text: 'Year', color: '#ffffff' },
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255,255,255,0.2)' },
          },
          y: {
            title: { display: true, text: 'Average Popularity', color: '#ffffff' },
            ticks: { color: '#ffffff' },
            grid: { color: 'rgba(255,255,255,0.2)' },
          },
        },
      },
    });
  }
}
