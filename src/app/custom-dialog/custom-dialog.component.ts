import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-dialog',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css']
})
export class CustomDialogComponent implements OnInit, OnDestroy {
  @Input() message: string = '';  // Message to display
  @Input() timeout: number = 5000; // Timeout duration in milliseconds (default: 5 seconds)
  @Input() title: string = '';    // Dialog title
  
  isDialogVisible: boolean = true; // Track dialog visibility
  progress: number = 0;           // Progress bar percentage
  progressInterval: any;         // Interval for the progress bar
  constructor() {}
  
  ngOnInit(): void {
    // Start the progress bar when the dialog is displayed
    this.startProgressBar();
  }
  ngOnDestroy(): void {
    // Clear the interval if the component is destroyed
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
  }


  // Start the progress bar to show the timeout
  startProgressBar(): void {
    const step = 100 / (this.timeout / 100);  // Calculate progress step based on timeout duration
    let currentProgress = 0;
    
    this.progressInterval = setInterval(() => {
      currentProgress += step;
      this.progress = currentProgress;

      // Once the progress reaches 100%, close the dialog
      if (currentProgress >= 100) {
        clearInterval(this.progressInterval);
        this.closeDialog();
      }
    }, 30); // Update every 100ms
  }

  // Method to close the dialog
  closeDialog(): void {
    this.isDialogVisible = false; // Hide the dialog
  }
}
