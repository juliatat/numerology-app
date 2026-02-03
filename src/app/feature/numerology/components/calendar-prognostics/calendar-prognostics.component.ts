import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TranslateModule} from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ArcaneNumberService} from '../../services/arcane-number.service';

export interface DayArcane {
  day: number;
  arcane: number;
}

@Component({
  selector: 'app-calendar-prognostics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule, MatCardModule, MatGridListModule],
  templateUrl: './calendar-prognostics.component.html',
  styleUrl: './calendar-prognostics.component.scss',
})
export class CalendarPrognosticsComponent {
  readonly birthDate = input<Date | null>(null);
  readonly year = input<number | null>(null);
  readonly month = input<number | null>(null);

  readonly rowHeight = signal('50px');
  readonly gutterSize = signal('4px');

  private readonly arcaneNumberService = inject(ArcaneNumberService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 599px)')
      .pipe(takeUntilDestroyed())
      .subscribe(state => {
        this.rowHeight.set(state.matches ? '44px' : '50px');
        this.gutterSize.set(state.matches ? '2px' : '4px');
      });
  }

  readonly days = computed<DayArcane[]>(() => {
    const birthDate = this.birthDate();
    const year = this.year();
    const month = this.month();
    if (!birthDate || !year || !month) return [];

    const daysInMonth = new Date(year, month, 0).getDate();

    const birthDayArcane = this.arcaneNumberService.toArcane(birthDate.getDate());
    const birthMonth = birthDate.getMonth() + 1;
    const birthYearArcane = this.arcaneNumberService.toArcane(
      this.arcaneNumberService.sumDigits(birthDate.getFullYear())
    );
    const targetYearArcane = this.arcaneNumberService.toArcane(
      this.arcaneNumberService.sumDigits(year)
    );

    return Array.from({length: daysInMonth}, (_, i) => {
      const day = i + 1;

      const targetDateArcane = this.arcaneNumberService.toArcane(
        this.arcaneNumberService.toArcane(day) + month + targetYearArcane
      );

      return {
        day,
        arcane: this.arcaneNumberService.toArcane(
          birthDayArcane + birthMonth + birthYearArcane + targetDateArcane
        ),
      };
    });
  });

  trackByDay(item: DayArcane): number {
    return item.day;
  }

  todayDay(): number | null {
    const year = this.year();
    const month = this.month();
    if (!year || !month) return null;
    const today = new Date();
    if (today.getFullYear() === year && today.getMonth() + 1 === month) {
      return today.getDate();
    }
    return null;
  }
}
