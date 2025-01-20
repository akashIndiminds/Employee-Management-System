import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component'; // Import Dashboard Component
import { AttendanceComponent } from './attendance/attendance.component'; 
import { AdminComponent } from './admin/admin.component';
import {RegisterUserComponent} from './registeruser/registeruser.component'
import { ReportComponent } from './reports/report.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  {path:  'attendance', component: AttendanceComponent},
  {path: 'admin', component:AdminComponent},
  {path: 'registeruser', component:RegisterUserComponent},
  {path: 'report', component:ReportComponent}
];
