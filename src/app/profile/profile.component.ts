import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule ,RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  loading = true;
  error: string | null = null;
  editMode = false;
  selectedFile: File | null = null;
  isLoggedIn = false;

  constructor(private UserService: UserService ,private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('EMS_token');
    this.isLoggedIn = !!token;
    this.loadProfile();
  }

  loadProfile() {
    this.UserService.profile().subscribe({
      next: (res) => {
        this.user = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  logout() {
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
      background: isDark ? '#1b1b1b' : '#fff',
      color: isDark ? '#f3f4f6' : '#111827',
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

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveProfile() {
    const formData = new FormData();
    formData.append('firstName', this.user.firstName);
    formData.append('lastName', this.user.lastName);
    formData.append('email', this.user.email);
    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    this.UserService.updateProfile(formData).subscribe({
      next: (res) => {
        this.user = res.data;
        this.editMode = false;
      },
      error: (err) => {
        this.error = 'Update failed';
      }
    });
  }
}
