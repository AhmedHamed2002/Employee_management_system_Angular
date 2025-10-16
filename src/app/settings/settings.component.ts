import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterLink],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  user: any = { firstName: '', lastName: '', email: '', role: '' };
  selectedFile: File | null = null;
  error: string | null = null;
  loading = true;

  constructor(private UserService: UserService, private router: Router , private toastr: ToastrService) {
    this.loadProfile();
  }

  loadProfile() {
    this.UserService.profile().subscribe({
      next: (res) => {
        this.loading = false;
        this.user = res.data;
      },
      error: () => {
        this.error = 'Failed to load profile';
      }
    });
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
      next: () => {
        this.toastr.success('Profile updated successfully', 'Success');
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Update failed');
      }
    });
  }
}

