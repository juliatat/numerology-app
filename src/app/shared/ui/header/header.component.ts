import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
  styleUrl: 'header.component.scss',
  template: `
    <header>
      <h1>{{ 'HEADER.TITLE' | translate }}</h1>
    </header>
  `,
})
export class HeaderComponent {
}
