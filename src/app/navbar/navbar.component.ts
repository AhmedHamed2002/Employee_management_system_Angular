import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, Renderer2, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Dropdown } from 'flowbite';
import { EmployeeService } from '../employee.service';
import { UserService } from '../user.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements AfterViewInit, OnInit {
  isDarkMode = false;
  avatar: string | null = null;
  role: string | null = null;
  isLoggedIn = false;
  mobileMenuOpen = false;

  constructor(
    private renderer: Renderer2,
    private employeeService: EmployeeService,
    private UserService: UserService,
    private router: Router ,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('EMS_token');
    this.isLoggedIn = !!token;

    if (token) {
      this.employeeService.getHomeStats(token).subscribe({
        next: (res) => {
          this.avatar = res.data.avatar;
          this.role = res.data.role;
        },
        error: (err) => {
          this.toastr.error('Error fetching home stats:',err.error?.message || 'Login failed');
        }
      });
    }
  }

  ngAfterViewInit() {
  const dropdownTrigger = document.getElementById('dropdownNavbarLink');
  const dropdownElement = document.getElementById('dropdownNavbar');
  if (dropdownTrigger && dropdownElement) {
    new Dropdown(dropdownElement, dropdownTrigger);
  }

  setTimeout(() => {
    this.isDarkMode = document.documentElement.classList.contains('dark');
  });
}

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(document.documentElement, 'dark');
      localStorage.setItem('theme', 'light');
    }
  }

onLogout() {
  const isDark = localStorage.getItem('theme') === 'dark';

  Swal.fire({
    title: 'Are you sure?',
    text: 'You will be logged out of EmployeeMS.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: isDark ? '#4f46e5' : '#3085d6',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes, logout!',
    cancelButtonText: 'Cancel',
    background: isDark ? '#1b1b1b' : '#fff',  // خلفية حسب المود
    color: isDark ? '#f3f4f6' : '#111827',    // النص حسب المود
    customClass: {
      popup: 'rounded-xl shadow-lg',
      confirmButton: 'px-4 py-2 font-semibold rounded-lg',
      cancelButton: 'px-4 py-2 font-semibold rounded-lg'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      this.UserService.logout().subscribe({
        next: () => {
          localStorage.setItem('EMS_logged', 'false');
          localStorage.removeItem('EMS_token');
          this.isLoggedIn = false;
          this.avatar = null;
          this.router.navigate(['/login']);

          Swal.fire({
            title: 'Logged out!',
            text: 'You have been logged out successfully.',
            icon: 'success',
            background: isDark ? '#1b1b1b' : '#fff',
            color: isDark ? '#f3f4f6' : '#111827',
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error!',
            text: 'Something went wrong while logging out.',
            icon: 'error',
            background: isDark ? '#1b1b1b' : '#fff',
            color: isDark ? '#f3f4f6' : '#111827',
          });
        }
      });
    }
  });
}


closeNavbar() {
  const navbar = document.getElementById('navbar-default');
  this.mobileMenuOpen = false;
  if (navbar) navbar.classList.add('hidden');
}

}
