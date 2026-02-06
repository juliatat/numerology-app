import {ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';

import {routes} from './app.routes';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerIntl} from '@angular/material/datepicker';

import {ArcanaTranslateLoader} from './core/i18n/arcana-translate-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    provideNativeDateAdapter(),
    MatDatepickerIntl,
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: ArcanaTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
  ]
};
