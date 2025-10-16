import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { NgxParticlesModule } from '@tsparticles/angular';
import { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim" ;
import { NgParticlesService } from "@tsparticles/angular";
import { MoveDirection, OutMode } from "@tsparticles/engine";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule , NgxParticlesModule ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  usersCount: number = 0;
  employeesCount: number = 0;
  role: string = '';
  id = "tsparticles";
  particlesOptions = {
  background: {
    color: { value: "transparent" },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: { enable: true, mode: "push" },
      onHover: { enable: true, mode: "repulse" },
      resize: { enable: true, delay: 0.5 },
    },
    modes: {
      push: { quantity: 4 },
      repulse: { distance: 200, duration: 0.4 },
    },
  },
  particles: {
    color: { value: "#ffffff" },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      enable: true,
      direction: MoveDirection.none,
      outModes: { default: OutMode.bounce },
      speed: 2,
    },
    number: {
      value: 60,
      density: { enable: true, area: 800 },
    },
    opacity: { value: 0.5 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 5 } },
  },
  detectRetina: true,
};



  constructor(private employeeService: EmployeeService , private readonly ngParticlesService: NgParticlesService , private toastr: ToastrService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('EMS_token');
    if (token) {
      this.employeeService.getHomeStats(token).subscribe({
        next: (res) => {
          this.usersCount = res.data.usersCount;
          this.employeesCount = res.data.employeesCount;
          this.role = res.data.role;
        },
        error: (err) => {
          this.toastr.error('Error fetching home stats:',err.error?.message || 'Login failed');
        }
      });
    }
    this.ngParticlesService.init(async (engine) => {
      await loadSlim(engine);
    });
  }
  particlesLoaded(container: Container): void {
    }

}
