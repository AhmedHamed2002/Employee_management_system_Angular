import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  imports: [ReactiveFormsModule, CommonModule ,RouterLink],
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;
    this.loading = true;

    this.userService.forgotPassword(this.forgotForm.value.email).subscribe({
      next: (res) => {
        this.loading = false;
        if(res.status == 'success'){
          this.toastr.success(res.message, 'Success');
          this.router.navigate(['/reset-password']);
        }
      },
      error: (err) => {
        this.loading = false;
        if(err.error.status =='fail'){
          this.toastr.warning(err.error?.data || 'Faild to send email', 'Fail');
        } else if(err.error.status == 'error'){
          this.toastr.error(err.error?.message || 'Faild to send email', 'Error');
        }
      },
    });
  }
}

