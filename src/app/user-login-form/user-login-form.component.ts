import { Component, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrl: './user-login-form.component.scss'
})
export class UserLoginFormComponent {
  @Input() userData = { Username: '', Password: '' };

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}
  

  // This is the function responsible for sending the form inputs to the backend
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        // Logic for a successful user login goes here! (To be implemented)
        this.dialogRef.close(); // This will close the modal on success!
        localStorage.setItem('user', result.user.Username);
        localStorage.setItem('token', result.token);
        this.snackBar.open('User logged in successfully!', 'OK', {
          duration: 2000
        });
        this.router.navigate(['movies']);
      },
      (error) => {
        let errorMessage = 'An error occurred while logging in.';
        if (error.status === 401) {
          errorMessage = 'Invalid username or password.';
        }
        this.snackBar.open(errorMessage, 'OK', {
          duration: 2000
        });
      }
    );
  }
}
