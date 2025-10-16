import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adduser',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './adduser.component.html',
  styleUrl: './adduser.component.css'
})
export class AdduserComponent {
  employeeForm!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isDark = false;

  departments = ["HR","IT","Finance","Marketing","Sales","Operations","Customer Support","Management"];
  genders = ["male","female"];

  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.isDark = localStorage.getItem('theme') === 'dark';
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      gender: ['', Validators.required],
      birthday: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
      hireDate: [null],
      salary: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit() {
    if (this.employeeForm.invalid) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill all required fields correctly.',
        icon: 'warning',
        background: this.isDark ? '#1b1b1b' : '#fff',
        color: this.isDark ? '#f3f4f6' : '#111827',
      });
      return;
    }

    const formData = new FormData();

    Object.entries(this.employeeForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    const token = localStorage.getItem('EMS_token') || '';
    this.employeeService.createEmployee(formData, token).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: 'Success',
          text: 'Employee created successfully',
          icon: 'success',
          background: this.isDark ? '#1b1b1b' : '#fff',
          color: this.isDark ? '#f3f4f6' : '#111827',
        });
        this.employeeForm.reset();
        this.previewUrl = null;
      },
      error: (err: any) => {
        if(err.error.status === 'fail'){
          Swal.fire({
            title: 'Fail',
            text: err.error?.data || err.error?.message || 'Failed to create employee',
            icon: 'warning',
            background: this.isDark ? '#1b1b1b' : '#fff',
            color: this.isDark ? '#f3f4f6' : '#111827',
          });
        }
        else{
          Swal.fire({
            title: 'Error',
            text: err.error?.data || err.error?.message || 'Failed to create employee',
            icon: 'error',
            background: this.isDark ? '#1b1b1b' : '#fff',
            color: this.isDark ? '#f3f4f6' : '#111827',
          });
        }
      }
    });
  }
}
