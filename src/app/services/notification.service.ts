import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { baseUrl } from '../app.config';  // Import baseUrl

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
  link?: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this.loadNotifications();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount.asObservable();
  }

  loadNotifications(): void {
    this.http.get<Notification[]>(`${baseUrl}/notifications`)  // Use baseUrl
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

  markAsRead(notificationId: number): void {
    this.http.put(`${baseUrl}/notifications/${notificationId}/read`, {}) // Use baseUrl
      .subscribe({
        next: () => {
          const updatedNotifications = this.notifications.value.map(notification => 
            notification.id === notificationId ? { ...notification, isRead: true } : notification
          );
          this.notifications.next(updatedNotifications);
          this.updateUnreadCount(updatedNotifications);
        }
      });
  }

  markAllAsRead(): void {
    this.http.put(`${baseUrl}/notifications/mark-all-read`, {}) // Use baseUrl
      .subscribe({
        next: () => {
          const updatedNotifications = this.notifications.value.map(notification => 
            ({ ...notification, isRead: true })
          );
          this.notifications.next(updatedNotifications);
          this.updateUnreadCount(updatedNotifications);
        }
      });
  }

  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    this.unreadCount.next(unreadCount);
  }
}
