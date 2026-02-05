import {ChangeDetectionStrategy, Component, effect, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {I18nService} from '../../../core/i18n/i18n.service';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        [attr.aria-label]="'FOOTER.THEME' | translate"
      >
        <mat-icon>brightness_6</mat-icon>
      </button>

      <!-- Language switch -->
      <button
        mat-icon-button
        [matMenuTriggerFor]="langMenu"
        [attr.aria-label]="'FOOTER.CHANGE_LANGUAGE' | translate"
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
export class FooterComponent {
  readonly i18n = inject(I18nService);

  private readonly theme = signal<'light' | 'dark'>('light');

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    this.theme.set(savedTheme === 'dark' ? 'dark' : 'light');

    effect(() => {
      const theme = this.theme();
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }

  toggleTheme() {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  setLang(lang: 'en' | 'ru') {
    this.i18n.setLang(lang);
  }
}
