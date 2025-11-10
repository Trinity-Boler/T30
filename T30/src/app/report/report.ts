import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-report',
  templateUrl: './report.html',
  styleUrls: ['./report.scss']
})
export class Report implements OnInit {
  ngOnInit(): void {
    const ctx = document.getElementById('reportChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['PlayStation', 'Xbox', 'PC', 'Switch'],
        datasets: [{
          label: 'User Adoption (%)',
          data: [50, 20, 25, 5],
          backgroundColor: ['#1976d2', '#7b1fa2', '#43a047', '#fdd835']
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
