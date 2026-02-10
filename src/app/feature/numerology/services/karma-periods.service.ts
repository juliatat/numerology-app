import {Injectable} from '@angular/core';

const PERIOD_1_LENGTH = 36;
const PERIOD_N_LENGTH = 9;

export interface KarmaPeriodsResult {
  k1: string;
  k2: string;
  k3: string;
  k4StartYear: number;
}

/**
 * Calculates karma periods K1–K4 (period 5 is not calculated).
 * K1 = [год рождения] – [год рождения + 36 − число жизненного пути]; then +9 for each next period.
 */
export function getKarmaPeriods(
  birthYear: number,
  lifePathNumber: number
): KarmaPeriodsResult {
  const p1End = birthYear + PERIOD_1_LENGTH - lifePathNumber;
  const p2End = p1End + PERIOD_N_LENGTH;
  const p3End = p2End + PERIOD_N_LENGTH;

  return {
    k1: `${birthYear} - ${p1End}`,
    k2: `${p1End} - ${p2End}`,
    k3: `${p2End} - ${p3End}`,
    k4StartYear: p3End,
  };
}

@Injectable({
  providedIn: 'root',
})
export class KarmaPeriodsService {
  getPeriods(birthYear: number, lifePathNumber: number): KarmaPeriodsResult {
    return getKarmaPeriods(birthYear, lifePathNumber);
  }
}
