import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  imports: [ReactiveFormsModule, CommonModule ,RouterLink],
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', Validators.required],
      newPassword: ['', [Validators.required,Validators.minLength(6),Validators.maxLength(6)]],
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) return;
    this.loading = true;

    this.userService.resetPassword(this.resetForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        if(res.status == 'success'){
          this.toastr.success(res.message, 'Success');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.loading = false;
        if(err.error.status =='fail'){
          this.toastr.warning(err.error?.data || 'Invalid or expired code', 'Fail');
        } else if(err.error.status == 'error'){
          this.toastr.error(err.error?.message || 'Invalid or expired code', 'Error');
        }
      },
    });
  }
}
