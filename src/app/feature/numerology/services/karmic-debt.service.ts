import {Injectable} from '@angular/core';
import {KarmicDebtResult} from '../../../core/models/karmic-debt-types';

const KarmicDebt = [13, 14, 16, 19];

@Injectable({providedIn: 'root'})
export class KarmicDebtService {

  calculate(lifePath: number, birthDay: number, nameNumber: number): KarmicDebtResult[] {
    const nums = [lifePath, birthDay, nameNumber];

    const uniqueNums = [...new Set(nums)];

    const debts: KarmicDebtResult[] = [];
    uniqueNums.forEach(num => {
      if (KarmicDebt.includes(num as number)) {
        debts.push({ value: num as 13 | 14 | 16 | 19 });
      }
    });

    return debts;
  }
}
