import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LifePathNumber} from '../../../core/models/numerology-types';

@Injectable({
  providedIn: 'root'
})
export class NumerologyCalculateService {

  constructor(private translate: TranslateService) {
  }

  calculateLifePathNumber(date: string): LifePathNumber {
    const digits = date.replace(/\D/g, '');
    let sum = digits.split('').reduce((acc, d) => acc + Number(d), 0);

    while (sum > 9) {
      sum = sum.toString().split('').reduce((acc, d) => acc + Number(d), 0);
    }

    return sum as LifePathNumber;
  }
}
