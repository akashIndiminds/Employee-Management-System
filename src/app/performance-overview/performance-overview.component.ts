import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';


@Component({
  selector: 'app-performance-overview', 
  standalone:true,
  imports:[CommonModule],
  templateUrl: './performance-overview.component.html', 
  styleUrls: ['./performance-overview.component.css'] 
})
export class PerformanceOverviewComponent implements OnInit {

  @Input() title: string = 'Performance Overview'; // Default title, can be overridden
  @Input() date: string = ''; // Input for the date
  @Input() status: string = ''; // Input for the status (e.g., 'completed', 'pending')
  @Output() viewReportClicked = new EventEmitter<void>(); // Output event when "View Report" is clicked

  statusClass: string = ''; // Class to dynamically style the status

  ngOnInit(): void {
    this.setStatusClass(); // Set initial status class on component initialization
  }

  setStatusClass() {
    switch (this.status.toLowerCase()) {
      case 'completed':
        this.statusClass = 'status-completed';
        break;
      case 'pending':
        this.statusClass = 'status-pending';
        break;
      case 'failed':
        this.statusClass = 'status-failed';
        break;
      default:
        this.statusClass = 'status-default'; // Default class if status is not recognized
        break;
    }
  }

  onViewReportClick() {
    this.viewReportClicked.emit(); // Emit the event to the parent component
  }
}