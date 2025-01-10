import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopBarComponent {
  @Input() employeeFullName: string | undefined = '';  // Allow undefined
  @Output() toggleSidebar = new EventEmitter<void>();  // Event emitter to toggle sidebar

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}
