import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, ButtonModule, SidebarModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  toggle() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen);
  }
}