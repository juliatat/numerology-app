import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MonthArcane, MonthlyPrognosticsService} from '../../services/monthly-prognostics.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-monthly-prognostics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatListModule,
    TranslateModule,
  ],
  templateUrl: './monthly-prognostics.component.html',
  styleUrls: ['./monthly-prognostics.component.scss'],
})
export class MonthlyPrognosticsComponent {
  readonly birthDate = input<Date | null>(null);
  readonly selectedYear = input<number | null>(null);
  readonly monthlyChange = output<number>();
  private readonly monthlyPrognosticsService = inject(MonthlyPrognosticsService);

  readonly selectedMonth = signal<number>(new Date().getMonth() + 1);

  readonly months = computed<MonthArcane[]>(() => {
    const birthDate = this.birthDate();
    const year = this.selectedYear();
    if (!birthDate || !year) return [];
    return this.monthlyPrognosticsService.calculateMonths(birthDate, year);
  });

  constructor() {
    effect(() => {
      const birthDate = this.birthDate();
      const year = this.selectedYear();
      if (!birthDate || !year) return;

      this.months();
      this.monthlyChange.emit(this.selectedMonth());
    });
  }

  selectMonth(month: number): void {
    this.selectedMonth.set(month);
    this.monthlyChange.emit(month);
  }

  trackByMonth(month: MonthArcane): number {
    return month.month;
  }

}
