import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef,  Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../services/employee.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../services/notification.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule,  MatIconModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopBarComponent implements OnInit {
  welcomeMessage: string = ''; // Holds the welcome message
  notifications: Notification[] = [];
  unreadCount: number = 0;
  showNotifications: boolean = false;
  
  @Output() toggleSidebar = new EventEmitter<void>(); // Event emitter to toggle the sidebar
  @Input() isMobile: boolean = false;
  
  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router,
    private notificationService: NotificationService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    const employeeCode = this.authService.getEmployeeCode(); // Get employee code from AuthService

    if (employeeCode) {
      this.employeeService.getEmployeeDetails(employeeCode).subscribe(
        (response) => {
          this.welcomeMessage = response.message; // Extract the welcome message
        },
        (error) => {
          this.welcomeMessage = 'Welcome, Guest!'; // Fallback message
        }
      );
    } else {
      this.welcomeMessage = 'Welcome, Guest!';
    }
    this.notificationService.loadNotifications();
    this.notificationService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });
    
    this.notificationService.getUnreadCount().subscribe((count) => {
      this.unreadCount = count;
    });
  }

  toggleNotificationsPanel(event: Event) {
    event.stopPropagation();
    this.showNotifications = !this.showNotifications;
    console.log("Notification panel visibility:", this.showNotifications);
  }
  

  markAsRead(notification: Notification) {
    console.log("Mark all as read clicked");
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe(() => {
        notification.isRead = true;
        this.unreadCount--; // Decrement unread count
      });
    }
  }
  
  markAllAsRead() {
    console.log("Mark all as read clicked");
    this.notificationService.markAllAsRead().subscribe(() => {
      this.notifications.forEach((notification) => (notification.isRead = true));
      this.unreadCount = 0; // Reset unread count
    });
  }
  
  

  onToggleSidebar() {
    this.toggleSidebar.emit(); // Emit the event to toggle the sidebar
  }

  goToProfile() {
    this.router.navigate(['/settings']);
  }

  /** Close notification panel when clicking outside */
  @HostListener('document:click', ['$event'])
  closeNotifications(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showNotifications = false;
    }
  }
}
