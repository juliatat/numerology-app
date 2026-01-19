import {Injectable} from '@angular/core';
import {ArcaneNumberService} from './arcane-number.service';

export interface YearArcane {
  year: number;
  positive: number;
  negative: number;
}

@Injectable({providedIn: 'root'})
export class YearlyPrognosticsService {
  constructor(private arcane: ArcaneNumberService) {
  }

  calculateYears(birthDate: Date, selectedYear: number): YearArcane[] {
    const years = [
      selectedYear - 1,
      selectedYear,
      selectedYear + 1,
      selectedYear + 2,
      selectedYear + 3,
    ];

    return years.map(year => ({
      year,
      positive: this.arcane.toArcane(
        birthDate.getDate() +
        (birthDate.getMonth() + 1) +
        this.arcane.sumDigits(year)
      ),
      negative: this.arcane.toArcane(
        birthDate.getDate() +
        (birthDate.getMonth() + 1) +
        this.arcane.sumDigits(year) +
        this.arcane.sumDigits(birthDate.getFullYear())
      ),
    }));
  }
}
