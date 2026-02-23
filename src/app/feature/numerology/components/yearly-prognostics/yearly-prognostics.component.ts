import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  NativeDateAdapter
} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {YearArcane, YearlyPrognosticsService} from '../../services/yearly-prognostics.service';
import {TranslateModule} from '@ngx-translate/core';
import {I18nService} from '../../../../core/i18n/i18n.service';
import {ArcanaModalService} from '../../services/arcana-modal.service';

class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date): string {
    return `${date.getFullYear()}`;
  }
}

export const YEAR_FORMAT = {
  parse: {dateInput: 'YYYY'},
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-yearly-prognostics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatListModule,
    TranslateModule
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: YEAR_FORMAT},
  ],
  templateUrl: './yearly-prognostics.component.html',
  styleUrl: './yearly-prognostics.component.scss',
})
export class YearlyPrognosticsComponent {
  readonly birthDate = input<Date | null>(null);
  readonly negativeArcana = input<number[]>([]);
  readonly yearChange = output<number>();
  private readonly yearlyPrognosticsService = inject(YearlyPrognosticsService);
  private readonly i18n = inject(I18nService);
  private readonly dateAdapter = inject(DateAdapter<Date>);
  private readonly arcanaModal = inject(ArcanaModalService);

  readonly selectedYear = signal(new Date().getFullYear());
  readonly yearPickerDate = computed(() => new Date(this.selectedYear(), 0, 1));

  readonly years = computed<YearArcane[]>(() => {
    const birthDate = this.birthDate();
    if (!birthDate) return [];
    return this.yearlyPrognosticsService.calculateYears(birthDate, this.selectedYear());
  });

  readonly form = new FormGroup({
    year: new FormControl<Date | null>(this.yearPickerDate()),
  });

  constructor() {
    effect(() => {
      const next = this.yearPickerDate();
      const current = this.form.controls.year.value;
      if (!current || current.getFullYear() !== next.getFullYear()) {
        this.form.controls.year.setValue(next, {emitEvent: false});
      }
    });

    effect(() => {
      const lang = this.i18n.lang();
      const locale = lang === 'ru' ? 'ru-RU' : 'en-US';
      this.dateAdapter.setLocale(locale);
    });
  }

  onYearSelected(date: Date, picker: MatDatepicker<Date>): void {
    const year = date.getFullYear();
    this.selectedYear.set(year);
    picker.close();
    this.yearChange.emit(year);
  }

  onYearClick(item: YearArcane): void {
    const birthDate = this.birthDate();
    if (!birthDate) return;
    const today = new Date();
    const { calculated, active, isBeforeBirthday } =
      this.yearlyPrognosticsService.getActiveYearArcan(
        birthDate,
        item.year,
        today.getMonth() + 1,
        today.getDate()
      );
    this.arcanaModal.openForPath(
      [item.positive, item.negative],
      this.negativeArcana(),
      'year',
      {
        year: item.year,
        positiveArcana: calculated.positive,
        negativeArcana: calculated.negative,
        activePositiveArcana: active.positive,
        activeNegativeArcana: active.negative,
        isBeforeBirthday,
      }
    );
  }
}
