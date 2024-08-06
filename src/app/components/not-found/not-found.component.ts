import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle,
} from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    MatCardModule,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  constructor() {}
}
