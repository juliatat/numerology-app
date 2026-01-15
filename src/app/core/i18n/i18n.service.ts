import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

const STORAGE_KEY = 'lang';

@Injectable({providedIn: 'root'})
export class I18nService {
  constructor(private translate: TranslateService) {
  }

  init(): void {
    const savedLang = localStorage.getItem(STORAGE_KEY);
    const browserLang = this.getBrowserLang();
    const lang = savedLang || browserLang || 'en';

    this.translate.setDefaultLang('en');
    this.translate.use(lang);
  }

  setLang(lang: 'en' | 'ru'): void {
    localStorage.setItem(STORAGE_KEY, lang);
    this.translate.use(lang);
  }

  private getBrowserLang(): 'en' | 'ru' | null {
    const lang = navigator.language.split('-')[0];
    return lang === 'en' || lang === 'ru' ? lang : null;
  }
}
