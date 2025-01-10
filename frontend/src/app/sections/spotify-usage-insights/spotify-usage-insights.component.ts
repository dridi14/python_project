import { Component, OnInit, HostListener } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Chart, registerables } from 'chart.js';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-spotify-usage-insights',
  standalone: true,
  templateUrl: './spotify-usage-insights.component.html',
  styleUrls: ['./spotify-usage-insights.component.css'],
  providers: [SpotifyService],
  imports: [HttpClientModule, RouterModule],
})
export class SpotifyUsageInsightsComponent implements OnInit {
  deviceChart!: Chart;
  devices: any[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private router: Router
  ) {
    Chart.register(...registerables);
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      // Scroll down
      this.router.navigate(['/favorite-genres']);
    } else if (event.deltaY < 0) {
      this.router.navigate(['/track-characteristics']);
    }
  }

  ngOnInit(): void {
    this.fetchDeviceData();
  }

  fetchDeviceData(): void {
    this.spotifyService.getTopDevices().subscribe(
      (data: any) => {
        this.devices = data;
        this.initializeDeviceChart();
      },
      (error) => {
        console.error('Error fetching device data:', error);
      }
    );
  }

  initializeDeviceChart(): void {
    const ctx = document.getElementById('deviceChart') as HTMLCanvasElement;

    const chartData = {
      labels: this.devices.map((item: any) => item.device),
      datasets: [
        {
          label: 'Most Common Devices',
          data: this.devices.map((item: any) => item.count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    if (this.deviceChart) {
      this.deviceChart.destroy();
    }

    this.deviceChart = new Chart(ctx, {
      //@ts-ignore
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) =>
                `${context.label}: ${context.raw} (${(
                  (context.raw as number /
                    this.devices.reduce(
                      (sum: number, item: any) => sum + item.count,
                      0
                    )) *
                  100
                ).toFixed(2)}%)`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
