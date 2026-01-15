import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {I18nService} from '../../../core/i18n/i18n.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <footer>
      <span>© 2026 Numerology App</span>
      <button (click)="toggleTheme()">{{ 'FOOTER.THEME' | translate }}</button>
      <div>
        <button (click)="setLang('en')"> {{ 'FOOTER.LANGUAGE.EN' | translate }}</button>
        <button (click)="setLang('ru')">{{ 'FOOTER.LANGUAGE.RU' | translate }}</button>
      </div>
    </footer>
  `
})
export class FooterComponent implements OnInit {
  constructor(public i18n: I18nService) {
  }

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  setLang(lang: 'en' | 'ru') {
    this.i18n.setLang(lang);
  }
}
