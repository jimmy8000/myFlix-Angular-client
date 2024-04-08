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

  constructor(private fetchApiData: UserRegistrationService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (resp: any) => {
        this.movies = resp;
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
      }
    });
  }

  openDetailsDialog(name: string, description: string): void {
    this.dialog.open(DetailsComponentComponent, {
      data: { name, description },
    });
  }
}
