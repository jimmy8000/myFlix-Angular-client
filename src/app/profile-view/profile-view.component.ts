import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { catchError, throwError } from 'rxjs';

interface UserData {
  Username: string;
  Password: string;
  Email: string;
  Birthday: string;
  FavoriteMovies: string[];
}

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  userData: UserData | null = null;
  favoriteMovies: any[] = [];
  private subscriptions: Subscription = new Subscription();
  MovieCardComponent: any;

  constructor(
    private fetchApiData: UserRegistrationService,
    public router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getCurrentUser(): string | null {
    return localStorage.getItem('user');
  }

  getUser(): void {
    const user = this.getCurrentUser();
    if (user) {
      this.subscriptions.add(
        this.fetchApiData
          .getUser(user)
          .pipe(
            catchError((error) => {
              console.error('Error fetching user data:', error);
              this.snackBar.open(
                'Something bad happened; please try again later.',
                'OK',
                {
                  duration: 2000,
                }
              );
              return throwError(() => new Error('Error fetching user data'));
            })
          )
          .subscribe({
            next: (resp: UserData) => {
              this.userData = resp;
              this.fetchApiData.getAllMovies().subscribe((response: any) => {
                this.favoriteMovies = response.filter((movie: any) => {
                  return (
                    this.userData?.FavoriteMovies?.includes(movie._id) ?? false
                  );
                });
              });
            },
            error: (error) => {
              console.error('Error fetching user data:', error);
              this.snackBar.open(
                'Something bad happened; please try again later.',
                'OK',
                {
                  duration: 2000,
                }
              );
            },
          })
      );
    } else {
      this.snackBar.open('No user found; please log in again.', 'OK', {
        duration: 2000,
      });
    }
  }

  openUserUpdateDialog(): void {
    const dialogRef = this.dialog.open(UserRegistrationFormComponent, {
      width: '400px',
      data: {
        title: 'UPDATE USER',
        button: 'Update',
        mode: 'update',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getUser();
    });
  }

  deleteUser(): void {
    if (confirm('Do you want to delete your account permanently?')) {
      try {
        this.router.navigate(['/welcome']).then(() => {
          localStorage.clear();
          this.snackBar.open('Your account has been deleted', 'OK', {
            duration: 3000,
          });
        });
        this.fetchApiData.deleteUser().subscribe((result) => {
          console.log(result);
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        this.snackBar.open(
          'Something went wrong while deleting your account. Please try again later.',
          'OK',
          {
            duration: 3000,
          }
        );
      }
    }
  }
}
