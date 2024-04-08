import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service';
import { DetailsComponentComponent } from '../details-component/details-component.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(
    private fetchApiData: UserRegistrationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (resp: any) => {
        this.movies = resp;
        console.log(this.movies);
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      },
    });
  }

  openDetailsDialog(name: string, description: string): void {
    this.dialog.open(DetailsComponentComponent, {
      data: { name, description },
    });
  }

  favoriteMovies: string[] = []; 

  getFavoriteMovies(): void {
    this.fetchApiData.getUserFavoriteMovies().subscribe({
      next: (resp: any[]) => {
        this.favoriteMovies = resp.map((movie) => movie._id); 
      },
      error: (err) => {
        console.error('Error fetching favorite movies:', err);
      },
    });
  }

  toggleFavorite(movieId: string): void {
    if (this.favoriteMovies.includes(movieId)) {
      this.removeFavorite(movieId);
    } else {
      this.addFavorite(movieId);
    }
  }

  addFavorite(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe({
      next: () => {
        this.favoriteMovies.push(movieId);
      },
      error: (err) => {
        console.error('Error adding to favorites:', err);
      },
    });
  }

  removeFavorite(movieId: string): void {
    this.fetchApiData.removeFavoriteMovie(movieId).subscribe({
      next: () => {
        const index = this.favoriteMovies.indexOf(movieId);
        if (index > -1) {
          this.favoriteMovies.splice(index, 1);
        }
      },
      error: (err) => {
        console.error('Error removing from favorites:', err);
      },
    });
  }
}
