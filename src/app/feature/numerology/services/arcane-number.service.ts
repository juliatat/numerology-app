import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ArcaneNumberService {

  toArcane(num: number): number {
    if (!num) return 22;

    const arcane = Math.abs(num) % 22;
    return arcane || 22;
  }


  sumDigits(num: number): number {
    return Math.abs(num)
      .toString()
      .split('')
      .map(digit => Number(digit))
      .reduce((sum, digit) => sum + digit, 0);
  }
}
