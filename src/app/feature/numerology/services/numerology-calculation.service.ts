import {inject, Injectable} from '@angular/core';
import {LifePathNumber} from '../../../core/models/numerology-types';
import {ArcaneNumberService} from './arcane-number.service';

function sumDigits(n: number): number {
  let s = 0;
  let x = Math.floor(Math.abs(n));
  while (x > 0) {
    s += x % 10;
    x = Math.floor(x / 10);
  }
  return s;
}

function reduceToSingleDigit(n: number): number {
  let x = n;
  while (x > 9) {
    x = sumDigits(x);
  }
  return x;
}

@Injectable({
  providedIn: 'root',
})
export class NumerologyCalculateService {
  private readonly arcaneService = inject(ArcaneNumberService);

  calculateLifePathNumber(date: Date): LifePathNumber {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const total = sumDigits(day) + sumDigits(month) + sumDigits(year);
    return reduceToSingleDigit(total) as LifePathNumber;
  }

  /** Leading arcana: [Source (day), Lesson (month), Implementation (year sum)]. */
  getLeadingArcana(date: Date): [number, number, number] {
    const source = this.arcaneService.toArcane(date.getDate());
    const lesson = date.getMonth() + 1;
    const yearDigitsSum = this.arcaneService.sumDigits(date.getFullYear());
    const implementation = this.arcaneService.toArcane(yearDigitsSum);
    return [source, lesson, implementation];
  }
}
