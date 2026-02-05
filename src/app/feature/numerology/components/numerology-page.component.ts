import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
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
import {KarmaCalculationService} from '../services/karma-calculation.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-numerology-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    KarmaBlockComponent,
    YearlyPrognosticsComponent,
    MonthlyPrognosticsComponent,
    CalendarPrognosticsComponent
  ],
  templateUrl: './numerology-page.component.html',
  styleUrl: './numerology-page.component.scss',
})

export class NumerologyPageComponent {
  readonly form = new FormGroup({
    name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    birthDate: new FormControl<Date | null>(null, Validators.required),
  });

  private readonly birthDateValue = toSignal(this.form.controls.birthDate.valueChanges, {
    initialValue: this.form.controls.birthDate.value,
  });

  readonly birthDate = computed(() => this.birthDateValue());

  readonly isSubmitted = signal(false);
  readonly lifePathNumber = signal<LifePathNumber | null>(null);
  readonly nameNumber = signal<number | null>(null);
  readonly karmicDebts = signal<KarmicDebtResult[]>([]);

  readonly selectedYear = signal<number>(new Date().getFullYear());
  readonly selectedMonth = signal<number>(new Date().getMonth() + 1);

  private readonly numerologyService = inject(NumerologyCalculateService);
  private readonly nameNumberService = inject(NameNumberService);
  private readonly karmicDebtService = inject(KarmicDebtService);
  private readonly karmaCalculationService = inject(KarmaCalculationService);

  /** Arcana from the karma block's negative column. Compared with year/month/calendar for negative karma extra. */
  readonly negativeArcana = computed(() => {
    const birthDate = this.birthDate();
    if (!birthDate) return [];
    const neg = this.karmaCalculationService.calculateNegative(birthDate);
    return [neg.k1, neg.k2, neg.k3, neg.k4, neg.k5];
  });

  calculate(): void {
    const birthDate = this.form.controls.birthDate.value;
    const name = this.form.controls.name.value.trim();
    if (!birthDate || !name) return;

    this.isSubmitted.set(true);

    const lifePathNumber = this.numerologyService.calculateLifePathNumber(birthDate);
    const nameNumber = this.nameNumberService.calculate(name);
    const karmicDebts = this.karmicDebtService.calculate(
      lifePathNumber,
      birthDate.getDate(),
      nameNumber
    );

    this.lifePathNumber.set(lifePathNumber);
    this.nameNumber.set(nameNumber);
    this.karmicDebts.set(karmicDebts);
  }

}
