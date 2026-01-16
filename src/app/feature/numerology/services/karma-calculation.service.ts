import {Injectable} from '@angular/core';
import {ArcaneNumberService} from './arcane-number.service';

export interface KarmaResult {
  k1: number;
  k2: number;
  k3: number;
  k4: number;
  k5: number;
}

@Injectable({
  providedIn: 'root',
})
export class KarmaCalculationService {

  constructor(private arcane: ArcaneNumberService) {
  }


  calculateNegative(birthDate: Date): KarmaResult {
    const {cha, m, ga} = this.getBaseNumbers(birthDate);

    const k1 = this.arcane.toArcane(cha - m);
    const k2 = this.arcane.toArcane(cha - ga);
    const k3 = this.arcane.toArcane(k1 - k2);
    const k4 = this.arcane.toArcane(m - ga);
    const k5 = this.arcane.toArcane(k1 + k2 + k3 + k4);

    return {k1, k2, k3, k4, k5};
  }

  calculatePositive(birthDate: Date): KarmaResult {
    const {cha, m, ga} = this.getBaseNumbers(birthDate);

    const k1 = this.arcane.toArcane(cha + m);
    const k2 = this.arcane.toArcane(cha + ga);
    const k3 = this.arcane.toArcane(k1 + k2);
    const k4 = this.arcane.toArcane(m + ga);
    const k5 = this.arcane.toArcane(k1 + k2 + k3 + k4);

    return {k1, k2, k3, k4, k5};
  }


  private getBaseNumbers(birthDate: Date) {
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const year = birthDate.getFullYear();

    const cha = this.arcane.toArcane(day);
    const m = month;
    const ga = this.arcane.toArcane(
      this.arcane.sumDigits(year)
    );

    return {cha, m, ga};
  }
}
