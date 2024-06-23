import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Userlocal } from '../../models/userlocal.model';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  users: Userlocal[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUserDataAndRenderChart();
    this.initializeObserver();
  }

  async loadUserDataAndRenderChart() {
    this.users = await this.userService.getAllUsersAsPromise();
    this.RenderChart();
  }

  RenderChart() {
    const ctxBar = document.getElementById('barchart') as HTMLCanvasElement;
    const ctxPieEasy = document.getElementById('piechart-easy') as HTMLCanvasElement;
    const ctxPieMedium = document.getElementById('piechart-medium') as HTMLCanvasElement;
    const ctxPieHard = document.getElementById('piechart-hard') as HTMLCanvasElement;

    const labels = this.users.map(user => user.displayName);
    const dataTotal = this.users.map(user => user.total);
    const dataEasy = this.users.map(user => user.easy);
    const dataMedium = this.users.map(user => user.medium);
    const dataHard = this.users.map(user => user.hard);

    const generateRandomColor = () => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return `rgba(${r}, ${g}, ${b}, 0.2)`;
    };

    const backgroundColors = this.users.map(() => generateRandomColor());
    const borderColors = backgroundColors.map(color => color.replace('0.2', '1'));

    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '# of Total Questions',
          data: dataTotal,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    new Chart(ctxPieEasy, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: '# of Easy Questions',
          data: dataEasy,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      }
    });

    new Chart(ctxPieMedium, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: '# of Medium Questions',
          data: dataMedium,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      }
    });

    new Chart(ctxPieHard, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: '# of Hard Questions',
          data: dataHard,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      }
    });
  }

  initializeObserver() {
    const options = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target); // Stop observing once in view
        }
      });
    }, options);

    document.querySelectorAll('.bar-chart, .pie-chart-1, .pie-chart-2, .pie-chart-3').forEach(el => {
      observer.observe(el);
    });
  }
}
