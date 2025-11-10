import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrls: ['./summary.scss']
})
export class Summary implements OnInit {
  ngOnInit(): void {
    const ctx = document.getElementById('summaryChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Wind', 'Solar', 'Hydro', 'Geothermal'],
        datasets: [{
          data: [40, 35, 15, 10],
          backgroundColor: ['#1e88e5', '#fdd835', '#43a047', '#8e24aa']
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Clean Energy Breakdown (%)'
          }
        }
      }
    });
  }
}
