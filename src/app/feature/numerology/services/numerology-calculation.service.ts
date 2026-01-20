import {Injectable} from '@angular/core';
import {LifePathNumber} from '../../../core/models/numerology-types';
import {ArcaneNumberService} from './arcane-number.service';

@Injectable({
  providedIn: 'root'
})
export class NumerologyCalculateService {

  constructor(private arcaneService: ArcaneNumberService) {
  }

  calculateLifePathNumber(date: Date): LifePathNumber {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const sum =
      this.arcaneService.sumDigits(day) +
      this.arcaneService.sumDigits(month) +
      this.arcaneService.sumDigits(year);

    return this.arcaneService.toArcane(sum) as LifePathNumber;
  }
}
