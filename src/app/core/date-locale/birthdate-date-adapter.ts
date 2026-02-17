import {Injectable} from '@angular/core';
import {NativeDateAdapter} from '@angular/material/core';

function to2digit(n: number): string {
  return ('0' + n).slice(-2);
}

/**
 * Parses DD/MM/YYYY or DD.MM.YYYY into a Date. Returns null if invalid or incomplete.
 * Rejects partial input (e.g. "0", "01/") so the datepicker doesn't show 01/01/2001.
 */
function parseDmy(value: string): Date | null {
  const sep = value.includes('.') ? '.' : '/';
  const parts = value.trim().split(sep).map((p) => p.trim());
  if (
    parts.length !== 3 ||
    parts[0].length !== 2 ||
    parts[1].length !== 2 ||
    parts[2].length !== 4
  ) {
    return null;
  }
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
  if (year < 100) return null;
  if (month < 0 || month > 11) return null;
  if (day < 1 || day > 31) return null;
  const d = new Date(year, month, day);
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
  return d;
}

@Injectable()
export class BirthdateDateAdapter extends NativeDateAdapter {
  override parse(value: unknown): Date | null {
    if (typeof value === 'string') {
      if (value.includes('/') || value.includes('.')) return parseDmy(value);
      return null;
    }
    return super.parse(value);
  }

  override format(date: Date, _displayFormat: object): string {
    return `${to2digit(date.getDate())}/${to2digit(date.getMonth() + 1)}/${date.getFullYear()}`;
  }
}
