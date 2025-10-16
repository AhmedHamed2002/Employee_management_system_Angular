import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { EmployeeService } from '../employee.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employeeForm!: FormGroup;
  employee: any;
  isLoading = true;
  error: string | null = null;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  editMode: boolean = false;
  isDark: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  ngOnInit(): void {
    this.isDark = localStorage.getItem('theme') === 'dark';
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('EMS_token') || '';

    if (id) {
      this.employeeService.getEmployeeById(id, token).subscribe({
        next: (res) => {

          this.employee = res.data;
          this.isLoading = false;

          this.employeeForm = this.fb.group({
            id: [this.employee.id, Validators.required],
            name: [this.employee.name, [Validators.required, Validators.minLength(3)]],
            email: [this.employee.email, [Validators.required, Validators.email]],
            position: [this.employee.position || ''],
            department: [this.employee.department || ''],
            phone: [this.employee.phone || ''],
            address: [this.employee.address || ''],
            gender: [this.employee.gender || ''],
            city: [this.employee.city || ''],
            age: [this.employee.age || ''],
            birthday: [
              this.employee.birthday
                ? new Date(this.employee.birthday).toISOString().split('T')[0]
                : ''
            ],
            hireDate: [
              this.employee.hireDate
                ? new Date(this.employee.hireDate).toISOString().split('T')[0]
                : ''
            ],
            createdAt: [this.employee.createdAt || ''],
            updatedAt: [this.employee.updatedAt || ''],
            salary: [this.employee.salary || 0]
          });
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to fetch employee details';
          this.isLoading = false;
        }
      });
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onUpdate() {
  if (this.employeeForm.invalid) {
    Swal.fire({
      title: 'Validation Error',
      text: 'Please check required fields.',
      icon: 'warning',
      background: this.isDark ? '#1b1b1b' : '#fff',
      color: this.isDark ? '#f3f4f6' : '#111827',
    });
    return;
  }

  const token = localStorage.getItem('EMS_token') || '';
  const formData = new FormData();

  Object.entries(this.employeeForm.value).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (key === 'birthday' || key === 'hireDate') {
        // Convert "YYYY-MM-DD" → ISO
        const isoDate = new Date(value as string).toISOString();
        formData.append(key, isoDate);
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  if (this.selectedFile) {
    formData.append('avatar', this.selectedFile);
  }

  this.employeeService.updateEmployee(formData, token).subscribe({
    next: (res) => {
      Swal.fire({
        title: 'Success',
        text: 'Employee updated successfully',
        icon: 'success',
        background: this.isDark ? '#1b1b1b' : '#fff',
        color: this.isDark ? '#f3f4f6' : '#111827',
      });
      this.employee = res.data;
      this.previewUrl = null;
      this.employeeForm.patchValue(this.employee);
    },
    error: (err) => {
      if (err.error.status === 'error') {
        Swal.fire({
          title: 'Error',
          text: err.error?.message || 'Update failed',
          icon: 'error',
          background: this.isDark ? '#1b1b1b' : '#fff',
          color: this.isDark ? '#f3f4f6' : '#111827',
        });
      } else if (err.error.status === 'fail') {
        Swal.fire({
          title: 'Fail',
          text: err.error?.data || 'Update failed',
          icon: 'warning',
          background: this.isDark ? '#1b1b1b' : '#fff',
          color: this.isDark ? '#f3f4f6' : '#111827',
        });
      }
    }
  });
  }

  onDelete() {
    const token = localStorage.getItem('EMS_token') || '';
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: this.isDark ? '#4f46e5' : '#3085d6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: this.isDark ? '#1b1b1b' : '#fff',
      color: this.isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployee(this.employee.id, token).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Employee has been deleted.',
              icon: 'success',
              background: this.isDark ? '#1b1b1b' : '#fff',
              color: this.isDark ? '#f3f4f6' : '#111827',
            });
            this.router.navigate(['/all-users']);
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: err.error?.message || 'Failed to delete employee.',
              icon: 'error',
              background: this.isDark ? '#1b1b1b' : '#fff',
              color: this.isDark ? '#f3f4f6' : '#111827',
            });
          }
        });
      }
    });
  }
}
