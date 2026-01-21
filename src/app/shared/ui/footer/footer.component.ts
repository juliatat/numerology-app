import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {I18nService} from '../../../core/i18n/i18n.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
    TranslatePipe,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar class="app-footer" color="primary">
      <span class="footer-copy">© 2026 Numerology App</span>

      <span class="spacer"></span>

      <!-- Theme toggle -->
      <button
        mat-icon-button
        (click)="toggleTheme()"
        aria-label="Toggle theme"
      >
        <mat-icon>brightness_6</mat-icon>
      </button>

      <!-- Language switch -->
      <button
        mat-icon-button
        [matMenuTriggerFor]="langMenu"
        aria-label="Change language"
      >
        <mat-icon>language</mat-icon>
      </button>

      <mat-menu #langMenu="matMenu">
        <button mat-menu-item (click)="setLang('en')">
          🇬🇧 {{ 'FOOTER.LANGUAGE.EN' | translate }}
        </button>
        <button mat-menu-item (click)="setLang('ru')">
          🇷🇺 {{ 'FOOTER.LANGUAGE.RU' | translate }}
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styleUrl: 'footer.component.scss'
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
