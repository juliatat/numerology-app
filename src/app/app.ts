import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {HeaderComponent} from './shared/ui/header/header.component';
import {FooterComponent} from './shared/ui/footer/footer.component';
import {RouterOutlet} from '@angular/router';
import {I18nService} from './core/i18n/i18n.service';

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
  protected readonly title = signal('numerology-app');

  // Ensures the service is instantiated at app startup.
  // (The service self-initializes; `init()` remains for backward compatibility.)
  private readonly _i18n = inject(I18nService);
}
