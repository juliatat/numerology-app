import {Component, signal} from '@angular/core';
import {HeaderComponent} from './shared/ui/header/header.component';
import {FooterComponent} from './shared/ui/footer/footer.component';
import {RouterOutlet} from '@angular/router';
import {I18nService} from './core/i18n/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.scss',
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
})
export class App {
  protected readonly title = signal('numerology-app');

  constructor(i18nService: I18nService) {
    i18nService.init();
  }
}
