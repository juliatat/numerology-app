import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {HeaderComponent} from './shared/ui/header/header.component';
import {FooterComponent} from './shared/ui/footer/footer.component';
import {RouterOutlet} from '@angular/router';
import {I18nService} from './core/i18n/i18n.service';
import {DateLocaleSyncService} from './core/date-locale/date-locale-sync.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  private readonly _i18n = inject(I18nService);
  private readonly _dateLocaleSync = inject(DateLocaleSyncService);
}
