import {Injectable, inject} from '@angular/core';
import {ArcaneNumberService} from './arcane-number.service';

export interface YearArcane {
  year: number;
  positive: number;
  negative: number;
}

export interface ActiveYearArcanResult {
  calculated: YearArcane;
  active: YearArcane;
  isBeforeBirthday: boolean;
}

@Injectable({providedIn: 'root'})
export class YearlyPrognosticsService {
  private readonly arcane = inject(ArcaneNumberService);

  /**
   * Returns true if (refMonth, refDay) is strictly before birthday (birthDate's month/day) in the target year.
   * Used to determine whether the user is still living the previous predictive year's energy.
   */
  isDateBeforeBirthday(refMonth: number, refDay: number, birthDate: Date): boolean {
    const birthMonth = birthDate.getMonth() + 1;
    const birthDay = birthDate.getDate();
    return refMonth < birthMonth || (refMonth === birthMonth && refDay < birthDay);
  }

  /**
   * Returns calculated year arcan, active (lived) year arcan, and whether the reference date is before birthday.
   * Predictive year starts on the user's birthday; before that date the user lives the previous year's energy.
   */
  getActiveYearArcan(
    birthDate: Date,
    targetYear: number,
    refMonth: number,
    refDay: number
  ): ActiveYearArcanResult {
    const years = this.calculateYears(birthDate, targetYear);
    const idx = years.findIndex(y => y.year === targetYear);
    const calculated = years[idx];
    const previousYear = idx > 0 ? years[idx - 1] : undefined;
    const isBeforeBirthday = this.isDateBeforeBirthday(refMonth, refDay, birthDate);
    const active =
      isBeforeBirthday && previousYear ? previousYear : calculated!;
    return { calculated: calculated!, active, isBeforeBirthday };
  }

  calculateYears(birthDate: Date, selectedYear: number): YearArcane[] {
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const birthYearSum = this.arcane.sumDigits(birthDate.getFullYear());

    const baseNegative = this.arcane.toArcane(
      this.arcane.sumDigits(day) +
      this.arcane.sumDigits(month) +
      birthYearSum
    );

    return Array.from({ length: 5 }, (_, i) => {
      const year = selectedYear - 1 + i;
      const yearSum = this.arcane.sumDigits(year);

      const positive = this.arcane.toArcane(day + month + yearSum);
      const negative = this.arcane.toArcane(
        baseNegative + this.arcane.toArcane(yearSum)
      );

      return { year, positive, negative };
    });
  }
}
