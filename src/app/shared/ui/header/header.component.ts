import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <h1>Iam Your Numerologist</h1>
    </header>
  `,
})
export class HeaderComponent {
}
