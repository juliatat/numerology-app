import {inject, Injectable} from '@angular/core';
import {LifePathNumber} from '../../../core/models/numerology-types';
import {ArcaneNumberService} from './arcane-number.service';

@Injectable({
  providedIn: 'root',
})
export class NumerologyCalculateService {
  private readonly arcaneService = inject(ArcaneNumberService);

  calculateLifePathNumber(date: Date): LifePathNumber {
    const day = this.arcaneService.toArcane(date.getDate());
    const month = date.getMonth() + 1;
    const yearDigitsSum = this.arcaneService.sumDigits(date.getFullYear());
    const year = this.arcaneService.toArcane(yearDigitsSum);
    const total = day + month + year;
    return this.arcaneService.toArcane(total) as LifePathNumber;
  }
}
