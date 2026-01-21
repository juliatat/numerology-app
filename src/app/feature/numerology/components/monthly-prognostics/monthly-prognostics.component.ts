import {Component, EventEmitter, inject, Input, OnChanges, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MonthArcane, MonthlyPrognosticsService} from '../../services/monthly-prognostics.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-monthly-prognostics',
  standalone: true,
  imports: [CommonModule, MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    MatInputModule,
    TranslateModule
  ],
  templateUrl: './monthly-prognostics.component.html',
  styleUrls: ['./monthly-prognostics.component.scss'],
})
export class MonthlyPrognosticsComponent implements OnChanges {
  @Input() birthDate!: Date;
  @Input() selectedYear!: number;
  @Output() monthlyChange = new EventEmitter<number>();
  private readonly monthlyPrognosticsService = inject(MonthlyPrognosticsService);

  months: MonthArcane[] = [];
  selectedMonth: number = new Date().getMonth() + 1;

  ngOnChanges(): void {
    if (this.birthDate && this.selectedYear) {
      this.updateMonths();
    }
  }

  updateMonths(): void {
    this.months = this.monthlyPrognosticsService.calculateMonths(this.birthDate, this.selectedYear);
    this.monthlyChange.emit(this.selectedMonth);
  }

  selectMonth(month: number): void {
    this.selectedMonth = month;
  }

  trackByMonth(month: MonthArcane): number {
    return month.month;
  }

}
