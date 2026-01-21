import {Injectable, inject} from '@angular/core';
import {ArcaneNumberService} from './arcane-number.service';

export interface YearArcane {
  year: number;
  positive: number;
  negative: number;
}

@Injectable({providedIn: 'root'})
export class YearlyPrognosticsService {
  private readonly arcane = inject(ArcaneNumberService);

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
