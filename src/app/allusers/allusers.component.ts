import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-allusers',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css']
})
export class AllusersComponent implements OnInit {
  employees: any[] = [];
  displayedEmployees: any[] = [];
  token: string | null = null;
  searchQuery: string = '';
  loading = false;
  role: string | null = null;
  isDark = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 3;
  totalPages = 0;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.isDark = localStorage.getItem('theme') === 'dark';
    this.token = localStorage.getItem('EMS_token');
    this.loadEmployees();
  }

  loadEmployees() {
    if (!this.token) return;
    this.loading = true;

    this.employeeService.getAllEmployees(this.token).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.status?.toLowerCase() === 'success') {
          this.role = res.role;
          this.employees = res.data;
          this.totalPages = Math.ceil(this.employees.length / this.itemsPerPage);
          this.updateDisplayedEmployees();
        } else {
          this.employees = [];
          Swal.fire({
            title: 'Unknown',
            text: 'Unexpected response from server',
            icon: 'info',
            background: this.isDark ? '#1b1b1b' : '#fff',
            color: this.isDark ? '#f3f4f6' : '#111827',
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.employees = [];
        Swal.fire({
          title: 'Error',
          text: err?.error?.message || 'Cannot connect to server',
          icon: 'error',
          background: this.isDark ? '#1b1b1b' : '#fff',
          color: this.isDark ? '#f3f4f6' : '#111827',
        });
      }
    });
  }

  search() {
    if (!this.token) return;

    if (!this.searchQuery.trim()) {
      this.loadEmployees();
      return;
    }

    this.loading = true;
    this.employeeService.searchEmployees(this.searchQuery, this.token).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.status?.toLowerCase() === 'success') {
          this.role = res.role;
          this.employees = res.data;
          this.currentPage = 1;
          this.totalPages = Math.ceil(this.employees.length / this.itemsPerPage);
          this.updateDisplayedEmployees();
        } else {
          this.employees = [];
          Swal.fire({
            title: 'Unknown',
            text: 'Unexpected response from server',
            icon: 'info',
            background: this.isDark ? '#1b1b1b' : '#fff',
            color: this.isDark ? '#f3f4f6' : '#111827',
          });
        }
      },
      error: (err: any) => {
        if (err.error.status === "fail") {
          this.loading = false;
          this.employees = [];

          Swal.fire({
            title: 'Warning',
            text: err?.error?.data || 'Cannot connect to server',
            icon: 'warning',
            background: this.isDark ? '#1b1b1b' : '#fff',
            color: this.isDark ? '#f3f4f6' : '#111827',
          });
        } else {
          this.loading = false;
          this.employees = [];
          Swal.fire({
            title: 'Error',
            text: err?.error?.message || 'Cannot connect to server',
            icon: 'error',
            background: this.isDark ? '#1b1b1b' : '#fff',
            color: this.isDark ? '#f3f4f6' : '#111827',
          });
        }
      }
    });
  }

  updateDisplayedEmployees() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedEmployees = this.employees.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayedEmployees();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedEmployees();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedEmployees();
    }
  }
}
