import {ArcaneNumberService} from './arcane-number.service';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NameNumberService {

  constructor(private arcane: ArcaneNumberService) {}

  calculate(name: string): number {
    if (!name) return 0;

    const sum = name
      .toUpperCase()
      .replace(/[^A-ZА-ЯЁ]/g, '')
      .split('')
      .map(char => this.getCharValue(char))
      .reduce((a, b) => a + b, 0);

    return this.arcane.toArcane(sum);
  }

  private getCharValue(char: string): number {
    // Latin
    if (char >= 'A' && char <= 'Z') {
      return char.charCodeAt(0) - 64;
    }

    // Cyrillic (А=1040)
    if (char >= 'А' && char <= 'Я') {
      return char.charCodeAt(0) - 1039;
    }

    return 0;
  }
}
