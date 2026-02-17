import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {trigger, transition, style, animate} from '@angular/animations';
import {AbstractControl, ReactiveFormsModule, FormGroup, FormControl, Validators, ValidationErrors} from '@angular/forms';
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
import {MatTabsModule} from '@angular/material/tabs';
import {DateMaskDirective} from '../../../core/date-locale/date-mask.directive';

function birthDateValidator(control: AbstractControl<Date | null>): ValidationErrors | null {
  const v = control.value;
  if (v === null || v === undefined) return null;
  if (!(v instanceof Date)) return {invalidDate: true};
  if (Number.isNaN(v.getTime())) return {invalidDate: true};
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (v.getTime() > today.getTime()) return {futureDate: true};
  return null;
}

@Component({
  selector: 'app-numerology-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tabsAppear', [
      transition(':enter', [
        style({opacity: 0, transform: 'translateY(-8px)'}),
        animate('300ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
      ]),
    ]),
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatTabsModule,
    DateMaskDirective,
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
    birthDate: new FormControl<Date | null>(null, [Validators.required, birthDateValidator]),
  });

  get maxBirthDate(): Date {
    return new Date();
  }

  private readonly birthDateValue = toSignal(this.form.controls.birthDate.valueChanges, {
    initialValue: this.form.controls.birthDate.value,
  });

  readonly birthDate = computed(() => this.birthDateValue());

  readonly isSubmitted = signal(false);
  readonly lifePathNumber = signal<LifePathNumber | null>(null);
  readonly leadingArcana = signal<[number, number, number] | null>(null);
  readonly nameNumber = signal<number | null>(null);
  readonly karmicDebts = signal<KarmicDebtResult[]>([]);

  readonly selectedTabIndex = signal(0);
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
    this.leadingArcana.set(this.numerologyService.getLeadingArcana(birthDate));
    this.nameNumber.set(nameNumber);
    this.karmicDebts.set(karmicDebts);
  }

}
