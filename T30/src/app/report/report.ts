import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
Chart.register(...registerables);

@Component({
  selector: 'app-report',
  templateUrl: './report.html',
  styleUrls: ['./report.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class Report implements OnInit, AfterViewInit {
  isLoggedIn = false;

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  ngAfterViewInit(): void {
    if (!this.isLoggedIn) return;

    const canvas = document.getElementById('reportChart') as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
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
