import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumerologyCalculateService {

  constructor() {}

  calcLifePathNumber(date: Date): number {
    const sumDigits = (n: number) =>
      n.toString().split('').reduce((a, b) => a + +b, 0);

    let sum = sumDigits(date.getFullYear()) + sumDigits(date.getMonth() + 1) + sumDigits(date.getDate());
    while (sum > 9) sum = sumDigits(sum);

    return sum;
  }
}
