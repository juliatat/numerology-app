import {HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslationObject} from '@ngx-translate/core';
import {forkJoin, map, Observable} from 'rxjs';

const I18N_PREFIX = 'i18n/';
const ARCANA_PREFIX = 'arcana/';
const ARCANA_FILES = Array.from({length: 22}, (_, i) =>
  `${String(i + 1).padStart(2, '0')}.json`
);

/**
 * Custom TranslateLoader that merges main i18n translations with
 * arcana descriptions loaded from arcana/{lang}/01.json through 22.json.
 */
export class ArcanaTranslateLoader implements TranslateLoader {
  constructor(private readonly http: HttpClient) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    const main$ = this.http.get<TranslationObject>(
      `${I18N_PREFIX}${lang}.json`
    );

    const arcanaRequests = ARCANA_FILES.map((file) =>
      this.http.get<Record<string, string>>(`${ARCANA_PREFIX}${lang}/${file}`)
    );

    return forkJoin([main$, ...arcanaRequests]).pipe(
      map(([main, ...arcanaParts]) => {
        const arcanaTree: Record<string, string> = {};
        for (const part of arcanaParts) {
          Object.assign(arcanaTree, part);
        }
        return {...main, ARCANA_TREE: arcanaTree} as TranslationObject;
      })
    );
  }
}
