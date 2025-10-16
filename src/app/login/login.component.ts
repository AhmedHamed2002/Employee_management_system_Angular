import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterLink]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('EMS_token');
    if (token) {
      this.userService.checkToken().subscribe({
        next: (res) => {
          if (res.status === 'success') {
            localStorage.setItem('EMS_logged', 'true');
            this.toastr.info('You are already logged in', 'Info');
            this.router.navigate(['/home']);
          }
        },
        error: () => {
          localStorage.removeItem('EMS_token');
        }
      });
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.userService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status === 'success') {
          this.toastr.success(res.data, 'Success');
          localStorage.setItem('EMS_token', res.token);
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.error.status === 'fail') {
          this.toastr.warning(err.error?.data || 'Login failed', 'Fail');
        } else if (err.error.status === 'error') {
          this.toastr.error(err.error?.message || 'Login failed', 'Error');
        }
      },
    });
  }
}
