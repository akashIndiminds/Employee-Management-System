// interfaces/attendance.interface.ts
export interface AttendanceDetail {
  date: string;
  check_in: string;
  check_out: string | null;
  hours_worked: number;
  overtime_hours: number;
  status: string;
  arrival_status: string;
}


export interface AttendanceResponse {
  attendance_details: AttendanceDetail[];
  summary: {
    total_hours_worked: number;
    total_overtime_hours: number;
    month: string;
    year: string;
    employee_code: string;
  };
  status: string;
  message: string;
}

export interface CalendarDay {
  date: Date | undefined;
  isWeekend: boolean;
  attendance?: AttendanceDetail;
  isCurrentMonth: boolean;
}