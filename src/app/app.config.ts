import {ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter} from '@angular/router';
import {provideAnimations} from '@angular/platform-browser/animations';

import {routes} from './app.routes';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepickerIntl} from '@angular/material/datepicker';

import {ArcanaTranslateLoader} from './core/i18n/arcana-translate-loader';
import {BirthdateDateAdapter} from './core/date-locale/birthdate-date-adapter';

const BIRTHDATE_FORMATS = {
  parse: {dateInput: 'DD/MM/YYYY'},
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    {provide: DateAdapter, useClass: BirthdateDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: BIRTHDATE_FORMATS},
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
