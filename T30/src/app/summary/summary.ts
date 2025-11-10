import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';

Chart.register(...registerables);

@Component({
  selector: 'app-summary',
  templateUrl: './summary.html',
  styleUrls: ['./summary.scss']
})
export class Summary implements OnInit {

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSummaryChart();
    setInterval(() => this.loadSummaryChart(), 10000); // auto-refresh every 10 seconds
  }

  loadSummaryChart(): void {
    this.http.get<any[]>('http://localhost:3000/api/summary').subscribe(data => {
      const labels = data.map(item => item.label);
      const values = data.map(item => item.value);

      const ctx = document.getElementById('summaryChart') as HTMLCanvasElement;

      // Destroy any existing chart before creating a new one (important for auto-refresh)
      const existingChart = Chart.getChart(ctx);
      if (existingChart) existingChart.destroy();

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: [
              '#1e88e5', '#fdd835', '#43a047', '#8e24aa'
            ]
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'CleanPlay Summary Metrics'
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    });
  }
}
