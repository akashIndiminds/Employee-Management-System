import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceOverviewComponent } from './performance-overview.component';

describe('PerformanceOverviewComponent', () => {
  let component: PerformanceOverviewComponent;
  let fixture: ComponentFixture<PerformanceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
