import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  OnInit, ViewChild, ElementRef } from '@angular/core';
import * as echarts from 'echarts';

interface GraphNode {
  id: string;
  name: string;
  popularity?: number;
  genre?: string;
}

interface GraphLink {
  source: string;
  target: string;
  // On peut ajouter un "value" ou un "similarityScore" pour pondérer la force
  value?: number;
}

@Component({
  selector: 'app-force-graph',
  standalone: true,
  imports: [CommonModule  ],
  templateUrl: './force-graph.component.html',
  styleUrl: './force-graph.component.css'
})

export class ForceGraphComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef<HTMLDivElement>;

  // Example data with popularity and genre
  nodes: GraphNode[] = [
    { id: 'u1', name: 'User 1', popularity: 120, genre: 'rock' },
    { id: 'u2', name: 'User 2', popularity: 80,  genre: 'pop'  },
    { id: 'u3', name: 'User 3', popularity: 200, genre: 'jazz' },
    { id: 'u4', name: 'User 4', popularity: 50,  genre: 'rock' },
    { id: 'u5', name: 'User 5', popularity: 150, genre: 'rock' },
    { id: 'u6', name: 'User 6', popularity: 90,  genre: 'pop'  },
    { id: 'u7', name: 'User 7', popularity: 60,  genre: 'jazz' },
    { id: 'u8', name: 'User 8', popularity: 110, genre: 'rock' },
    { id: 'u9', name: 'User 9', popularity: 70,  genre: 'pop'  },
    { id: 'u10', name: 'User 10', popularity: 130, genre: 'jazz' },
    // attribute or “concept” nodes
    { id: 'genreRock',  name: 'Rock',        popularity: 0, genre: 'rock' },
    { id: 'genrePop',   name: 'Pop',         popularity: 0, genre: 'pop'  },
    { id: 'genreJazz',  name: 'Jazz',        popularity: 0, genre: 'jazz' },
    { id: 'podcastFan', name: 'Podcast Fan', popularity: 0, genre: 'podcast' },

    { id: 'genreClassical', name: 'Classical', popularity: 0, genre: 'classical' },
    { id: 'genreHipHop', name: 'Hip Hop', popularity: 0, genre: 'hiphop' },
    { id: 'genreElectronic', name: 'Electronic', popularity: 0, genre: 'electronic' }
    
  ];

  links: GraphLink[] = [
    { source: 'u1', target: 'genreRock',  value: 1 },
    { source: 'u1', target: 'genrePop',  value: 1 },
    { source: 'u1', target: 'genreJazz',  value: 1 },
    { source: 'u1', target: 'podcastFan', value: 1 },
    { source: 'u2', target: 'genrePop',   value: 1 },
    { source: 'u3', target: 'genrePop',   value: 1 },
    { source: 'u3', target: 'podcastFan', value: 1 },
    { source: 'u4', target: 'genreJazz',  value: 1 },
    { source: 'u4', target: 'genreRock',  value: 1 },
    { source: 'u4', target: 'genrePop',  value: 1 },
    { source: 'u4', target: 'podcastFan',  value: 1 },
    { source: 'u4', target: 'genreJazz',  value: 1 },
    { source: 'u5', target: 'genreRock',  value: 1 },
    { source: 'u5', target: 'genrePop',  value: 1 },
    { source: 'u5', target: 'genreJazz',  value: 1 },
    { source: 'u5', target: 'podcastFan',  value: 1 },
    { source: 'u6', target: 'genrePop',  value: 1 },
    { source: 'u6', target: 'genreJazz',  value: 1 },
    { source: 'u6', target: 'podcastFan',  value: 1 },
    { source: 'u7', target: 'genreHipHop',  value: 1 },
    { source: 'u7', target: 'podcastFan',  value: 1 },
    // A direct link between users 2 and 3 if they share some similarity
    { source: 'u2', target: 'u3',         value: 0.5 },
    { source: 'u10', target: 'genreJazz',  value: 1 },
    { source: 'u10', target: 'genreRock',  value: 1 },

  ];

  constructor() {}

  ngOnInit(): void {
    this.initChart();
  }

  /**
   * Map a genre or group to a color.
   */
  private getColorByGenre(genre: string | undefined): string {
    if (!genre) return '#cccccc';
    switch (genre.toLowerCase()) {
      case 'rock':     return '#e74c3c'; // red
      case 'pop':      return '#3498db'; // blue
      case 'jazz':     return '#9b59b6'; // purple
      case 'podcast':  return '#2ecc71'; // green
      case 'hiphop':   return '#2ecc71'; // green
      case 'electronic': return '#2ecc71'; // green
      default:         return '#7f8c8d'; // gray fallback
    }
  }

  /**
   * Convert popularity into a symbolSize (node radius).
   */
  private getSymbolSize(popularity: number | undefined): number {
    if (!popularity) return 20; // default baseline
    const minSize = 20;
    const maxSize = 80;
    const scaledSize = minSize + (popularity / 200) * (maxSize - minSize);
    return Math.round(scaledSize);
  }

  private initChart(): void {
    const chart = echarts.init(this.chartContainer.nativeElement);

    const option: echarts.EChartsOption = {
      title: {
        text: 'Force-Directed Graph (Spotify Example)',
        left: 'center'
      },
      tooltip: {
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            // Show name + popularity (or any other info)
            const node = params.data;
            return `<b>${node.name}</b><br/>
                    Popularity: ${node.popularity || 0}<br/>
                    Genre: ${node.genre || 'n/a'}`;
          } else if (params.dataType === 'edge') {
            return `Lien: ${params.data.source} → ${params.data.target}`;
          }
          return '';
        }
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          force: {
            repulsion: 80,
            edgeLength: 100,
            gravity: 0.1
          },
          roam: true,
          data: this.nodes.map(n => ({
            id: n.id,
            name: n.name,
            popularity: n.popularity, // can access in tooltip
            genre: n.genre,           // can access in tooltip
            symbolSize: this.getSymbolSize(n.popularity),
            itemStyle: {
              color: this.getColorByGenre(n.genre)
            }
          })),
          edges: this.links.map(l => ({
            source: l.source,
            target: l.target,
            value: l.value || 1
          }))
        }
      ]
    };

    chart.setOption(option);

    window.addEventListener('resize', () => {
      chart.resize();
    });
  }
}