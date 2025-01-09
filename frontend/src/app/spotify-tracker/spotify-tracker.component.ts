import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { CommonModule } from '@angular/common';

// Register Chart.js components
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);
@Component({
  selector: 'app-spotify-tracker',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    FlexLayoutModule,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './spotify-tracker.component.html',
  styleUrls: ['./spotify-tracker.component.css'],
})
export class SpotifyTrackerComponent implements OnInit {
  form: FormGroup;
  data: any[] = [];
  displayedColumns: string[] = [
    'track_name',
    'artist_name',
    'year',
    'popularity',
  ];
  chart: any;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = this.fb.group({
      year: [''],
      artist: [''],
      genre_language: [''],
      duration: [''],
      acoustic_instrumental: [''],
      energy_tempo: [''],
      key_mode: [''],
      popularity: [''],
      language: [''],
      tempo: [''],
      valence: [''],
      danceability: [''],
      loudness: [''],
    });
  }

  ngOnInit(): void {}

  fetchData() {
    const params = new HttpParams({ fromObject: this.form.value });
    this.http
      .get<any[]>('http://localhost:8000/api/spotify-tracker/', { params })
      .subscribe(
        (response) => {
          console.log(response);
          this.data = response;
          this.updateChart();
        },
        (error) => console.error(error)
      );
  }

  updateChart() {
    if (this.chart) {this.chart.dispose();}
    const ctx = (
      document.getElementById('spotifyChart') as HTMLCanvasElement
    ).getContext('2d');

    const popularityDataset = {
      label: 'Popularity',
      data: this.data.map((track) => track.popularity),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    };

    const danceabilityDataset = {
      label: 'Danceability',
      data: this.data.map((track) => track.danceability),
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1,
    };

    this.chart = new Chart(<any>ctx, {
      type: 'bar',
      data: {
        labels: this.data.map((track) => track.track_name), // X-axis
        datasets: [popularityDataset, danceabilityDataset], // Multiple datasets
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
              },
            },
          },
        },
        scales: {
          x: { title: { display: true, text: 'Track Name' } },
          y: { title: { display: true, text: 'Metrics' }, beginAtZero: true },
        },
      },
    });
  }
}