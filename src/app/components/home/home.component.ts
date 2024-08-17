import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatButtonModule,
    MatTooltipModule,
    MatToolbarModule,
    NgIf,
    RouterModule,
    MatNavList,
    MatListItem,
    MatTooltipModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor() {}

  @ViewChild('sidenav') sidenav!: MatSidenav;
  @Output() sidenavState = new EventEmitter<boolean>();

  isSidenavExpanded = true;

  toggleSidenav() {
    this.isSidenavExpanded = !this.isSidenavExpanded;
    this.sidenav.toggle();
    this.sidenavState.emit(this.isSidenavExpanded);
  }
}
