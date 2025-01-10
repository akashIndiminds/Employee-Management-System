import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component'; // Import Dashboard Component
//import { AttendancePageComponent } from './attendance-page/attendance-page.component'; // Import your component

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  //{path: 'attendance', component: AttendancePageComponent},
];
