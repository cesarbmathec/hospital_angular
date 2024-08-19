import { NgClass, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  message: string;
  type: 'success' | 'danger' | 'warning';
  typeButton?: 'danger' | '';
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
}

@Component({
  selector: 'app-alert-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogContent, NgClass, MatDialogActions, NgIf],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.scss',
})
export class AlertDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
