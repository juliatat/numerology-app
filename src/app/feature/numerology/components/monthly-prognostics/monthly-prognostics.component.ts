import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MonthArcane, MonthlyPrognosticsService} from '../../services/monthly-prognostics.service';
import {YearlyPrognosticsService} from '../../services/yearly-prognostics.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import {TranslateModule} from '@ngx-translate/core';
import {ArcanaModalService} from '../../services/arcana-modal.service';

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
  styleUrl: './monthly-prognostics.component.scss',
})
export class MonthlyPrognosticsComponent {
  readonly birthDate = input<Date | null>(null);
  readonly selectedYear = input<number | null>(null);
  readonly negativeArcana = input<number[]>([]);
  readonly monthlyChange = output<number>();
  private readonly monthlyPrognosticsService = inject(MonthlyPrognosticsService);
  private readonly yearlyPrognosticsService = inject(YearlyPrognosticsService);
  private readonly arcanaModal = inject(ArcanaModalService);

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
      this.monthlyChange.emit(this.selectedMonth());
    });
  }

  selectMonth(month: number): void {
    this.selectedMonth.set(month);
    this.monthlyChange.emit(month);
  }

  onMonthClick(month: MonthArcane): void {
    const birthDate = this.birthDate();
    const year = this.selectedYear();
    if (!birthDate || !year) return;
    const { calculated, active, isBeforeBirthday } =
      this.yearlyPrognosticsService.getActiveYearArcan(
        birthDate,
        year,
        month.month,
        1
      );
    this.arcanaModal.openForPath(
      [active.positive, month.arcane],
      this.negativeArcana(),
      'month',
      {
        month: month.month,
        monthArcana: month.arcane,
        calculatedYearArcana: calculated.positive,
        yearArcana: active.positive,
        isBeforeBirthday,
      }
    );
  }

  trackByMonth(month: MonthArcane): number {
    return month.month;
  }

}
