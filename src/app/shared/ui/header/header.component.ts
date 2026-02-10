import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule, NgOptimizedImage],
  styleUrl: 'header.component.scss',
  template: `
    <header>
      <a class="logo-link" href="/">
        <img
          ngSrc="logo.svg"
          width="48"
          height="40"
          alt=""
          fetchpriority="high"
          class="logo-img">
        <h1 class="logo-title">{{ 'HEADER.TITLE' | translate }}</h1>
      </a>
    </header>
  `,
})
export class HeaderComponent {}
