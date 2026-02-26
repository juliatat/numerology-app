import {Directive, ElementRef, inject, NgZone, OnInit, Self} from '@angular/core';
import {NgControl} from '@angular/forms';

const SLASH = '/';
const MASK_LEN = 10; // DD/MM/YYYY

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function formatDdMmYyyy(digits: string): string {
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}${SLASH}${digits.slice(2)}`;
  return `${digits.slice(0, 2)}${SLASH}${digits.slice(2, 4)}${SLASH}${digits.slice(4, 8)}`;
}

function formatDateToMask(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function parseDdMmYyyy(value: string): Date | null {
  if (value.length !== MASK_LEN || value[2] !== SLASH || value[5] !== SLASH) return null;
  const day = parseInt(value.slice(0, 2), 10);
  const month = parseInt(value.slice(3, 5), 10) - 1;
  const year = parseInt(value.slice(6, 10), 10);
  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return null;
  if (year < 100) return null;
  if (month < 0 || month > 11) return null;
  if (day < 1 || day > 31) return null;
  const d = new Date(year, month, day);
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
  return d;
}

/**
 * Input mask for date in DD/MM/YYYY format.
 * Restricts input to digits and inserts slashes automatically.
 * Updates the bound form control with a Date when the mask is complete and valid, otherwise null.
 */
@Directive({
  selector: 'input[appDateMask]',
  host: {
    '[attr.maxlength]': '10',
    '(input)': 'onInput($event)',
    '(blur)': 'onBlur()',
    '(keydown)': 'onKeydown($event)',
    '(paste)': 'onPaste($event)',
  },
})
export class DateMaskDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLInputElement>);
  private readonly control = inject(NgControl, {self: true});
  private readonly ngZone = inject(NgZone);

  /** When we update the control from the mask, skip the next valueChanges and restore value + cursor after CVA has run. */
  private skipSyncFromControl = false;
  private pendingRestore: { value: string; cursor: number } | null = null;

  ngOnInit(): void {
    this.syncInputFromControl();
    this.control.valueChanges?.subscribe(() => {
      if (this.skipSyncFromControl) {
        this.skipSyncFromControl = false;
        this.applyPendingRestore();
        return;
      }
      this.syncInputFromControl();
    });
  }

  private applyPendingRestore(): void {
    const pending = this.pendingRestore;
    this.pendingRestore = null;
    if (!pending) return;
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          const input = this.el.nativeElement;
          input.value = pending.value;
          input.setSelectionRange(pending.cursor, pending.cursor);
        });
      }, 0);
    });
  }

  private syncInputFromControl(): void {
    const value = this.control.value;
    const input = this.el.nativeElement;
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      input.value = formatDateToMask(value);
    } else if (value === null && input.value.length === MASK_LEN) {
      input.value = '';
    }
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursor = input.selectionStart ?? 0;
    const oldLen = input.value.length;
    const digits = digitsOnly(input.value).slice(0, 8);
    const formatted = formatDdMmYyyy(digits);
    input.value = formatted;

    const newLen = formatted.length;
    let newCursor = cursor;
    if (oldLen === 3 && newLen === 4) newCursor = 4; // after first slash
    else if (oldLen === 6 && newLen === 7) newCursor = 7; // after second slash
    else if (digits.length < 3) newCursor = Math.min(cursor, formatted.length);
    else if (digits.length < 5) newCursor = Math.min(cursor + (formatted.length - oldLen), formatted.length);
    else newCursor = formatted.length;
    input.setSelectionRange(newCursor, newCursor);

    this.pendingRestore = { value: formatted, cursor: newCursor };
    this.updateControl(formatted);
  }

  onBlur(): void {
    const raw = this.el.nativeElement.value;
    const digits = digitsOnly(raw).slice(0, 8);
    const formatted = digits.length === 8 ? formatDdMmYyyy(digits) : raw;
    if (formatted.length === MASK_LEN) {
      this.el.nativeElement.value = formatted;
    }
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => this.updateControl(formatted));
      }, 0);
    });
  }

  onKeydown(event: KeyboardEvent): void {
    const input = this.el.nativeElement;
    const key = event.key;
    if (key === 'Backspace' && input.selectionStart === input.selectionEnd) {
      const pos = input.selectionStart ?? 0;
      if (pos === 4 || pos === 7) {
        event.preventDefault();
        const digits = digitsOnly(input.value);
        const withoutLast = digits.slice(0, digits.length - 1);
        const formatted = formatDdMmYyyy(withoutLast);
        const newCursor = Math.max(0, pos - 1);
        input.value = formatted;
        input.setSelectionRange(newCursor, newCursor);
        this.pendingRestore = { value: formatted, cursor: newCursor };
        this.updateControl(formatted);
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData('text') ?? '').trim();
    const digits = digitsOnly(pasted).slice(0, 8);
    const formatted = formatDdMmYyyy(digits);
    this.el.nativeElement.value = formatted;
    this.el.nativeElement.setSelectionRange(formatted.length, formatted.length);
    this.pendingRestore = { value: formatted, cursor: formatted.length };
    this.updateControl(formatted);
  }

  private updateControl(formatted: string): void {
    if (!this.control?.control) return;
    this.skipSyncFromControl = true;
    if (formatted.length === MASK_LEN) {
      const date = parseDdMmYyyy(formatted);
      this.control.control.setValue(date, {emitEvent: true});
    } else {
      this.control.control.setValue(null, {emitEvent: true});
    }
  }
}
