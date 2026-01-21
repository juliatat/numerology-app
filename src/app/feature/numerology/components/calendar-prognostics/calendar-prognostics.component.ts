import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {ArcaneNumberService} from '../../services/arcane-number.service';

export interface DayArcane {
  day: number;
  arcane: number;
}

@Component({
  selector: 'app-calendar-prognostics',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatCardModule, MatGridListModule],
  templateUrl: './calendar-prognostics.component.html',
  styleUrls: ['./calendar-prognostics.component.scss'],
})
export class CalendarPrognosticsComponent implements OnChanges {
  @Input() birthDate!: Date;
  @Input() year!: number;
  @Input() month!: number;

  days: DayArcane[] = [];

  private readonly arcaneNumberService = inject(ArcaneNumberService);

  ngOnChanges(changes: SimpleChanges): void {
    if (this.year && this.month) {
      this.generateCalendar(this.year, this.month);
    }
  }

  generateCalendar(year: number, month: number) {
    const daysInMonth = new Date(year, month, 0).getDate();

    const birthDayArcane = this.arcaneNumberService.toArcane(
      this.birthDate.getDate()
    );

    const birthMonth = this.birthDate.getMonth() + 1;

    const birthYearArcane = this.arcaneNumberService.toArcane(
      this.arcaneNumberService.sumDigits(this.birthDate.getFullYear())
    );

    const targetYearArcane = this.arcaneNumberService.toArcane(
      this.arcaneNumberService.sumDigits(year)
    );

    this.days = Array.from({length: daysInMonth}, (_, i) => {
      const day = i + 1;

      const targetDateArcane = this.arcaneNumberService.toArcane(
        this.arcaneNumberService.toArcane(day) +
        month +
        targetYearArcane
      );

      return {
        day,
        arcane: this.arcaneNumberService.toArcane(
          birthDayArcane +
          birthMonth +
          birthYearArcane +
          targetDateArcane
        ),
      };
    });
  }


  trackByDay(item: DayArcane): number {
    return item.day;
  }

  todayDay(): number | null {
    const today = new Date();

    if (
      today.getFullYear() === this.year &&
      today.getMonth() + 1 === this.month
    ) {
      return today.getDate();
    }

    return null;
  }
}
