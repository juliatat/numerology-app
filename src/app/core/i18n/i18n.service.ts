import {Injectable, effect, inject, signal} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

const STORAGE_KEY = 'lang';

export type AppLang = 'en' | 'ru';

@Injectable({providedIn: 'root'})
export class I18nService {
  private readonly translate = inject(TranslateService);

  readonly lang = signal<AppLang>('en');

  constructor() {
    this.translate.setDefaultLang('en');

    // Initialize from storage/browser once, then keep `TranslateService` in sync via an effect.
    const savedLang = localStorage.getItem(STORAGE_KEY);
    const browserLang = this.getBrowserLang();
    const initialLang = this.isAppLang(savedLang) ? savedLang : (browserLang ?? 'en');
    this.lang.set(initialLang);

    effect(() => {
      const lang = this.lang();
      localStorage.setItem(STORAGE_KEY, lang);
      this.translate.use(lang);
    });
  }

  /**
   * Backward-compatible initializer (safe to call, no-op for effect wiring).
   * Kept so existing callers don't break.
   */
  init(): void {
    // The service initializes itself in the constructor.
  }

  setLang(lang: AppLang): void {
    this.lang.set(lang);
  }

  private getBrowserLang(): AppLang | null {
    const lang = navigator.language.split('-')[0];
    return lang === 'en' || lang === 'ru' ? lang : null;
  }

  private isAppLang(value: string | null): value is AppLang {
    return value === 'en' || value === 'ru';
  }
}
