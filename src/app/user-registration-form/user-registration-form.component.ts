import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRegistrationService } from '../fetch-api-data.service';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  form!: FormGroup; 

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; button: string; mode: string }
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      Username: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.email]),
      Birthday: new FormControl('')
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.data.mode === 'update') {
        this.updateUser();
      } else {
        this.registerUser();
      }
    }
  }

  registerUser(): void {
    this.fetchApiData.userRegistration(this.form.value).subscribe(
      result => {
        this.dialogRef.close();
        this.snackBar.open('Registration Successful', 'OK', { duration: 2000 });
      },
      error => {
        this.snackBar.open('Registration Failed', 'OK', { duration: 2000 });
      }
    );
  }

  updateUser(): void {
    this.fetchApiData.updateUser(localStorage.getItem('user'), this.form.value).subscribe(
      result => {
        this.dialogRef.close();
        this.snackBar.open('Update Successful', 'OK', { duration: 2000 });
      },
      error => {
        this.snackBar.open('Update Failed', 'OK', { duration: 2000 });
      }
    );
  }
}
