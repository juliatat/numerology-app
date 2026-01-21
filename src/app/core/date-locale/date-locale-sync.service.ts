import {Injectable, effect, inject} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {I18nService} from '../i18n/i18n.service';

@Injectable({providedIn: 'root'})
export class DateLocaleSyncService {
  private readonly i18n = inject(I18nService);
  private readonly dateAdapter = inject(DateAdapter<Date>);

  constructor() {
    effect(() => {
      const lang = this.i18n.lang();

      const locale = lang === 'ru' ? 'ru-RU' : 'en-US';
      this.dateAdapter.setLocale(locale);
    });
  }
}

