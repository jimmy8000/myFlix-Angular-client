import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserRegistrationService } from '../fetch-api-data.service';
import { DetailsComponentComponent } from '../details-component/details-component.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favoriteMovies: string[] = [];

  constructor(
    private fetchApiData: UserRegistrationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMoviesAndFavorites();
  }
  getMoviesAndFavorites(): void {
    const userName = localStorage.getItem('user') ?? '';
    this.fetchApiData.getUser(userName).subscribe({
      next: (user: any) => {
        this.favoriteMovies = user.FavoriteMovies;
        this.getMovies();
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.snackBar.open('Failed to load user data!', 'OK', {
          duration: 3000,
        });
      },
    });
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (movies: any[]) => {
        this.movies = movies;
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
        this.snackBar.open('Failed to load movies!', 'OK', { duration: 3000 });
      },
    });
  }

  openDetailsDialog(name: string, description: string): void {
    this.dialog.open(DetailsComponentComponent, {
      data: { name, description },
    });
  }

  toggleFavorite(movieId: string): void {
    const isFavorite = this.favoriteMovies.includes(movieId);
    const operation = isFavorite
      ? this.fetchApiData.removeFavoriteMovie(movieId)
      : this.fetchApiData.addFavoriteMovie(movieId);

    operation.subscribe({
      next: () => {
        this.updateFavoriteMovies(movieId, !isFavorite);
        this.snackBar.open(
          `${isFavorite ? 'Removed from' : 'Added to'} favorites`,
          'OK',
          { duration: 2000 }
        );
      },
      error: (err) => {
        console.error(
          `Error ${isFavorite ? 'removing' : 'adding'} favorite:`,
          err
        );
        this.snackBar.open(
          `Failed to ${isFavorite ? 'remove from' : 'add to'} favorites`,
          'OK',
          { duration: 2000 }
        );
      },
    });
  }

  updateFavoriteMovies(movieId: string, add: boolean): void {
    if (add) {
      this.favoriteMovies.push(movieId);
    } else {
      const index = this.favoriteMovies.indexOf(movieId);
      if (index > -1) {
        this.favoriteMovies.splice(index, 1);
      }
    }
  }
}
