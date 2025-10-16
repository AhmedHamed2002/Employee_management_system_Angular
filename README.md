# 🧑‍💼 Employee Management System (EMS) – Angular Services

This project contains **two core Angular services** that handle API communication for an Employee Management System (EMS):
- **EmployeeService** – for managing employee data.
- **UserService** – for authentication and user profile management.

---

## 🚀 Features

### 👤 UserService
Handles all authentication and user-related operations:
- **Register:** Create a new account (`/user/register`)
- **Login:** Authenticate user credentials (`/user/login`)
- **Check Token:** Verify if JWT token is valid (`/user/check`)
- **Profile:** Retrieve user profile data (`/user/profile`)
- **Update Profile:** Update user information (`/user/profile`)
- **Logout:** Invalidate current user session (`/user/logout`)
- **Forgot Password:** Send reset password link (`/user/forgot-password`)
- **Reset Password:** Set new password after reset (`/user/reset-password`)

### 👨‍💻 EmployeeService
Manages CRUD operations for employees:
- **Get All Employees:** `/employee`
- **Get Employee By ID:** `/employee/:id`
- **Create Employee:** `/employee/create`
- **Update Employee:** `/employee/update`
- **Delete Employee:** `/employee/:id`
- **Search Employees:** `/employee/search?query=...`
- **Home Stats:** `/employee/home_stats`
