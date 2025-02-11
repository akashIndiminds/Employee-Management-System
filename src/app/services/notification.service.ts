import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl } from '../app.config';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export interface ApiNotification {
  id: number;
  text: string;
  created_at: string;
  is_read: boolean; // Add this field
  employee_code?: string; 
}

export interface Notification {
  id: number;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isGlobal: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient, private authService: AuthService) {}

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount.asObservable();
  }

  loadNotifications(): void {
    const employeeCode = this.authService.getEmployeeCode();

    if (employeeCode === 'NA') {
      console.warn('No employee code found. Cannot load notifications.');
      return;
    }

    let requestUrl = `${baseUrl}/notifications/${employeeCode}`;
    if (employeeCode.toUpperCase() === 'GLOBAL') {
      requestUrl = `${baseUrl}/notifications/GLOBAL`;
    }

    this.http.get<{ success: boolean; data: ApiNotification[] }>(requestUrl)
  .pipe(
    map(response => response.data.map(notification => ({
      id: notification.id,
      message: notification.text,
      timestamp: new Date(notification.created_at),
      isRead: notification.is_read, // Use the actual is_read value
      isGlobal: !notification.employee_code
    })))
  )
      .subscribe({
        next: (notifications) => {
          this.notifications.next(notifications);
          this.updateUnreadCount(notifications);
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
        }
      });
  }

  markAsRead(notificationId: number): Observable<void> {
    const employeeCode = this.authService.getEmployeeCode();
    if (employeeCode === 'NA') {
      console.warn('No employee code found. Cannot mark notification as read.');
      return new Observable<void>();
    }

    return this.http.put<void>(`${baseUrl}/notifications/mark-as-read`, {
      announcement_id: notificationId,
      employee_code: employeeCode
    }).pipe(
      map(() => {
        const updatedNotifications = this.notifications.value.map(notification =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        );
        this.notifications.next(updatedNotifications);
        this.updateUnreadCount(updatedNotifications);
      })
    );
  }

  markAllAsRead(): Observable<void> {
    const employeeCode = this.authService.getEmployeeCode();
    if (employeeCode === 'NA') {
      console.warn('No employee code found. Cannot mark all notifications as read.');
      return new Observable<void>();
    }

    return this.http.put<void>(`${baseUrl}/notifications/mark-all-read`, {
      employee_code: employeeCode
    }).pipe(
      map(() => {
        const updatedNotifications = this.notifications.value.map(notification =>
          ({ ...notification, isRead: true })
        );
        this.notifications.next(updatedNotifications);
        this.updateUnreadCount(updatedNotifications);
      })
    );
  }

  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    this.unreadCount.next(unreadCount);
  }
}
