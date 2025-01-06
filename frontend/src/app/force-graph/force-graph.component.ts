import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  OnInit, ViewChild, ElementRef } from '@angular/core';
import * as echarts from 'echarts';

interface GraphNode {
  id: string;
  name: string;
  // Tu peux ajouter d’autres propriétés, ex. group, plan, genre, etc.
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
  
    // Données fictives pour l’exemple
    nodes: GraphNode[] = [
      { id: 'u1', name: 'User 1' },
      { id: 'u2', name: 'User 2' },
      { id: 'u3', name: 'User 3' },
      { id: 'u4', name: 'User 4' },
      { id: 'genreRock', name: 'Rock' },
      { id: 'genrePop', name: 'Pop' },
      { id: 'genreJazz', name: 'Jazz' },
      { id: 'podcastFan', name: 'Podcast' }
    ];
  
    links: GraphLink[] = [
      // On relie les utilisateurs à leurs genres préférés (exemple)
      { source: 'u1', target: 'genreRock', value: 1 },
      { source: 'u2', target: 'genrePop', value: 1 },
      { source: 'u3', target: 'genrePop', value: 1 },
      { source: 'u3', target: 'podcastFan', value: 1 },
      { source: 'u4', target: 'genreJazz', value: 1 },
      // On peut relier user 2 et user 3 s’ils partagent bcp d’attributs
      { source: 'u2', target: 'u3', value: 0.5 }
    ];
  
    constructor() {}
  
    ngOnInit(): void {
      this.initChart();
    }
  
    private initChart(): void {
      // Initialiser ECharts sur la div
      const chart = echarts.init(this.chartContainer.nativeElement);
  
      // Construire l’option ECharts (type: 'graph' + layout: 'force')
      const option: echarts.EChartsOption = {
        title: {
          text: 'Force-Directed Graph (Spotify Example)',
          left: 'center'
        },
        tooltip: {
          formatter: (params: any) => {
            // Personnaliser le tooltip
            if (params.dataType === 'node') {
              return `<b>${params.data.name}</b>`;
            } else if (params.dataType === 'edge') {
              return `Lien: ${params.data.source} → ${params.data.target}`;
            }
            return '';
          }
        },
        // backgroundColor: '#fafafa', // optionnel
        series: [
          {
            type: 'graph',
            layout: 'force',
            // Animation des liens
            force: {
              repulsion: 80, // distance entre les nœuds (à ajuster)
              edgeLength: 100, // longueur des liens (à ajuster)
              gravity: 0.1 // attraction au centre, à ajuster
            },
            roam: true, // autorise zoom & déplacement de la scène
            data: this.nodes.map(n => {
              return {
                id: n.id,
                name: n.name,
                // symbolSize: personnalise la taille du nœud
                symbolSize: 40,
                // On peut colorer en fonction d’un attribut, ex. group
                itemStyle: {
                  color: '#6ea9db' // Couleur de base (modifiable par groupe)
                }
              };
            }),
            edges: this.links.map(l => {
              return {
                source: l.source,
                target: l.target,
                value: l.value || 1,
                // lineStyle: { ... } pour personnaliser l’aspect du lien
              };
            })
          }
        ]
      };
  
      // Appliquer l’option
      chart.setOption(option);
      // Ajustement responsif
      window.addEventListener('resize', () => {
        chart.resize();
      });
    }
  }