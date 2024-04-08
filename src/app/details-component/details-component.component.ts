import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-details-component',
  templateUrl: './details-component.component.html',
  styleUrls: ['./details-component.component.scss']
})
export class DetailsComponentComponent {
  // No need to inject the UserRegistrationService if not used here
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {name: string, description: string, additionalInfo?: any}
  ) {}

  ngOnInit(): void {
    // Handle additional initialization logic if necessary
  }
}
