import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component'; // Import Dashboard Component
import { AttendanceComponent } from './attendance/attendance.component'; 
import { AdminComponent } from './admin/admin.component';
import { RegisterUserComponent} from './registeruser/registeruser.component';
import { ReportComponent } from './reports/report.component';
import { AdminAttendanceComponent} from './setattendance/admin-attendance.component';
import {SettingsComponent} from './settings/settings.component';
import { MonthlyReportComponent } from './monthlyreports/MonthlyReportComponent';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  {path:  'attendance', component: AttendanceComponent},
  {path: 'admin', component:AdminComponent},
  {path: 'registeruser', component:RegisterUserComponent},
  {path: 'report', component:ReportComponent},
  {path: 'setattendance', component: AdminAttendanceComponent},
  {path: 'settings', component: SettingsComponent },
  {path: 'monthlyreports', component: MonthlyReportComponent}

];
