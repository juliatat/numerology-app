import {Component, Input, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  NativeDateAdapter
} from '@angular/material/core';
import {MatListModule} from '@angular/material/list';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {YearArcane, YearlyPrognosticsService} from '../../services/ yearly-prognostics.service';
import {TranslateModule} from '@ngx-translate/core';

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
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    TranslateModule
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: YEAR_FORMAT},
  ],
  templateUrl: './yearly-prognostics.component.html',
  styleUrls: ['./ yearly-prognostics.component.scss'],
})
export class YearlyPrognosticsComponent implements OnChanges {
  @Input() birthDate!: Date;

  selectedYear = new Date().getFullYear();
  yearPickerDate = new Date(this.selectedYear, 0, 1);

  years: YearArcane[] = [];

  form = new FormGroup({
    year: new FormControl<Date | null>(this.yearPickerDate),
  });

  constructor(private service: YearlyPrognosticsService) {
  }

  ngOnChanges(): void {
    if (this.birthDate) {
      this.update();
    }
  }

  onYearSelected(date: Date, picker: MatDatepicker<Date>): void {
    this.selectedYear = date.getFullYear();
    this.yearPickerDate = new Date(this.selectedYear, 0, 1);
    this.form.get('year')?.setValue(this.yearPickerDate);
    picker.close();
    this.update();
  }

  update(): void {
    this.years = this.service.calculateYears(this.birthDate, this.selectedYear);
  }
}
