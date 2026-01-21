import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import {NumerologyCalculateService} from '../services/numerology-calculation.service';
import {TranslateModule} from '@ngx-translate/core';
import {LifePathNumber} from '../../../core/models/numerology-types';
import {KarmaBlockComponent} from './karma-block/karma-block.component';
import {YearlyPrognosticsComponent} from './yearly-prognostics/yearly-prognostics.component';
import {MonthlyPrognosticsComponent} from './monthly-prognostics/monthly-prognostics.component';
import {CalendarPrognosticsComponent} from './calendar-prognostics/calendar-prognostics.component';
import {NameNumberService} from '../services/name-number.service';
import {KarmicDebtResult} from '../../../core/models/karmic-debt-typrs';
import {KarmicDebtService} from '../services/karmic-debt.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-numerology-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    KarmaBlockComponent,
    YearlyPrognosticsComponent,
    MonthlyPrognosticsComponent,
    CalendarPrognosticsComponent
  ],
  templateUrl: 'numerology-page.component.html',
  styleUrl: 'numerology-page.component.scss',
})

export class NumerologyPageComponent {
  isSubmitted = false;
  lifePathNumber?: LifePathNumber;
  nameNumber: number | null = null;
  karmicDebts: KarmicDebtResult[] = [];
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = new Date().getMonth();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    birthDate: new FormControl<Date | null>(null, Validators.required),
  });

  private readonly numerologyService = inject(NumerologyCalculateService);
  private readonly nameNumberService = inject(NameNumberService);
  private readonly karmicDebtService = inject(KarmicDebtService);

  get birthDate() {
    const value = this.form.value.birthDate;
    return value ? new Date(value) : null;
  }

  calculate(): void {
    const birthDate = this.form.get('birthDate')?.value;
    if (!birthDate) return;

    const name = this.form.get('name')?.value;
    if (!name) return;

    this.isSubmitted = true;

    this.lifePathNumber = this.numerologyService.calculateLifePathNumber(birthDate);

    this.nameNumber = this.nameNumberService.calculate(name);

    this.karmicDebts = this.karmicDebtService.calculate(this.lifePathNumber, birthDate.getDate(), this.nameNumber);
  }

}
