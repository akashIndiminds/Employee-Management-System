// interfaces/attendance.interface.ts
export interface AttendanceDetail {
  date: string;
  check_in: string;
  check_out: string;
  hours_worked: number;
  status: string;
  remarks: string;
  arrival_status: string;
}

export interface AttendanceResponse {
  attendance_details: AttendanceDetail[];
  summary: {
    total_hours_worked: number;
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