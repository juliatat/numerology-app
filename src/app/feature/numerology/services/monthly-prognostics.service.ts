import {Injectable} from '@angular/core';
import {ArcaneNumberService} from './arcane-number.service';

export interface MonthArcane {
  month: number;
  arcane: number;
  labelKey: string;
}

@Injectable({providedIn: 'root'})
export class MonthlyPrognosticsService {
  constructor(private arcaneNumberService: ArcaneNumberService) {
  }

  calculateMonths(birthDate: Date, year: number): MonthArcane[] {
    const months: MonthArcane[] = [];

    for (let m = 1; m <= 12; m++) {
      const value =
        birthDate.getDate() + m + this.arcaneNumberService.sumDigits(year);

      months.push({
        month: m,
        arcane: this.arcaneNumberService.toArcane(value),
        labelKey: `MONTHS.${m}`
      });
    }

    return months;
  }
}
