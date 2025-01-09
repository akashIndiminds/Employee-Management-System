import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `<h1>Welcome!</h1><p>Your Employee ID: {{ employeeId }}</p>`,
})
export class DashboardComponent implements OnInit {
  employeeId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.queryParamMap.get('id'); // Fetch Employee ID
  }
}
