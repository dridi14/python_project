import { Component, OnInit, HostListener } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MenuComponent } from '../../menu/menu.component';


@Component({
  selector: 'app-track-characteristics',
  standalone: true,
  templateUrl: './track-characteristics.component.html',
  styleUrls: ['./track-characteristics.component.css'],
  providers: [SpotifyService],
  imports: [CommonModule, HttpClientModule, RouterModule, MenuComponent],
})
export class TrackCharacteristicsComponent implements OnInit {
  chart!: Chart;
  totalMale: number = 0;
  totalFemale: number = 0;
  malePaidPercentage: number = 0;
  maleUnpaidPercentage: number = 0;
  femalePaidPercentage: number = 0;
  femaleUnpaidPercentage: number = 0;
  lastScrollTime: number = 0;

  constructor(private spotifyService: SpotifyService, private router: Router) {
    Chart.register(...registerables);
  }

  @HostListener('window:wheel', ['$event'])
    onWheel(event: WheelEvent) {
      if (Date.now() - this.lastScrollTime < 1000) return;
      this.lastScrollTime = Date.now();
      if (event.deltaY > 0) {
        this.router.navigate(['/spotify-usage-insights']);
      } else if (event.deltaY < 0) {
        this.router.navigate(['/yearly-trends']);
      }
    }

  ngOnInit(): void {
    this.fetchDemographicData();
  }

  fetchDemographicData(): void {
    this.spotifyService.getDemographicData().subscribe(
      (data: any) => {
        this.calculatePercentages(data);
        this.initializeBarChart();
      },
      (error) => {
        console.error('Error fetching demographic data:', error);
      }
    );
  }

  calculatePercentages(data: any): void {
    // Filter and calculate counts
    const maleData = data.filter((item: any) => item.Gender === 'Male');
    const femaleData = data.filter((item: any) => item.Gender === 'Female');
    console.log(maleData);
    this.totalMale = maleData.reduce((sum: number, item: any) => sum + item.count, 0);
    this.totalFemale = femaleData.reduce((sum: number, item: any) => sum + item.count, 0);

    const malePaid = maleData
      .filter((item: any) => item.spotify_subscription_plan.includes('Premium'))
      .reduce((sum: number, item: any) => sum + item.count, 0);

    const maleUnpaid = maleData
      .filter((item: any) => item.spotify_subscription_plan.includes('Free'))
      .reduce((sum: number, item: any) => sum + item.count, 0);

    const femalePaid = femaleData
      .filter((item: any) => item.spotify_subscription_plan.includes('Premium'))
      .reduce((sum: number, item: any) => sum + item.count, 0);

    const femaleUnpaid = femaleData
      .filter((item: any) => item.spotify_subscription_plan.includes('Free'))
      .reduce((sum: number, item: any) => sum + item.count, 0);
    // Calculate percentages
    this.malePaidPercentage = (malePaid / this.totalMale) * 100;
    this.maleUnpaidPercentage = (maleUnpaid / this.totalMale) * 100;
    this.femalePaidPercentage = (femalePaid / this.totalFemale) * 100;
    this.femaleUnpaidPercentage = (femaleUnpaid / this.totalFemale) * 100;
  }

  initializeBarChart(): void {
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;

    const chartData = {
      labels: ['Male Paid', 'Male Unpaid', 'Female Paid', 'Female Unpaid'],
      datasets: [
        {
          label: 'Subscription Percentages',
          data: [
            this.malePaidPercentage,
            this.maleUnpaidPercentage,
            this.femalePaidPercentage,
            this.femaleUnpaidPercentage,
          ],
          backgroundColor: ['#36A2EB', '#1E90FF', '#FF6384', '#FF1493'],
          borderColor: ['#36A2EB', '#1E90FF', '#FF6384', '#FF1493'],
          borderWidth: 1,
        },
      ],
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${(<any>context)?.['raw'].toFixed(2)}%`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value}%`,
            },
          },
        },
      },
    });
  }
}
