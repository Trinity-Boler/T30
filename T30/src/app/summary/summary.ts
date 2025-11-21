import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './summary.html',
  styleUrls: ['./summary.scss']
})
export class Summary implements OnInit, AfterViewInit {

  isLoggedIn = false;
  viewReady = false; // ensures DOM is loaded

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    // No token
    if (!token) {
      this.isLoggedIn = false;
      return;
    }

    // Token exists
    this.isLoggedIn = true;
  }

  ngAfterViewInit(): void {
    this.viewReady = true;

    // If logged in, load chart AFTER view initializes
    if (this.isLoggedIn) {
      this.loadSummaryChart();
    }
  }

  loadSummaryChart() {
    if (!this.viewReady) return; 

    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:3000/api/summary', { headers })
      .subscribe({
        next: (data) => {
          const labels = data.map(d => d.label);
          const values = data.map(d => d.value);

          const canvas = document.getElementById('summaryChart') as HTMLCanvasElement;
          if (!canvas) {
            console.error("Canvas not found.");
            return;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error("Failed to get canvas context.");
            return;
          }

          // Remove old chart if it exists
          const existing = Chart.getChart(canvas);
          if (existing) existing.destroy();

          // Create chart
          new Chart(ctx, {
            type: 'pie',
            data: {
              labels,
              datasets: [{
                data: values,
                backgroundColor: ['#1e88e5', '#fdd835', '#43a047', '#8e24aa']
              }]
            },
            options: {
              responsive: true,
              plugins: {
                title: { display: true, text: 'Summary Metrics' },
                legend: { position: 'bottom' }
              }
            }
          });
        },
        error: (err) => {
          console.error(err);
          alert('Failed to load summary. Please login again.');
        }
      });
  }
}
