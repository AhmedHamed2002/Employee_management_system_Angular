import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [ReactiveFormsModule, CommonModule ,RouterLink]
})
export class RegisterComponent {
  registerForm: FormGroup;
  avatar?: File;
  avatarPreview: string | ArrayBuffer | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
        ]
      ],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.avatar = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

  register() {
    if (this.registerForm.invalid) return;

    this.loading = true;

    const formData = new FormData();
    Object.keys(this.registerForm.value).forEach(key => {
      formData.append(key, this.registerForm.value[key]);
    });
    if (this.avatar) formData.append('avatar', this.avatar);

    this.userService.register(formData).subscribe({
      next: (res) => {
        this.loading = false;
        if(res.status == 'success'){
          this.toastr.success(res.data, 'Success');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.loading = false;
        if(err.error.status =='fail'){
          this.toastr.warning(err.error?.data || 'Registration failed', 'Fail');
        } else if(err.error.status == 'error'){
          this.toastr.error(err.error?.message || 'Registration failed', 'Error');
        }
      }
    });
  }

  // helper to check if field is invalid and touched
  isInvalid(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control?.invalid && (control?.dirty || control?.touched);
  }
}
