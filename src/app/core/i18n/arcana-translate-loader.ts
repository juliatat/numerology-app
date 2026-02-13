import {HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslationObject} from '@ngx-translate/core';
import {forkJoin, map, Observable} from 'rxjs';
import type {ArcanaData} from '../../feature/numerology/models/arcana-data.model';

const I18N_PREFIX = 'i18n/';
const ARCANA_PREFIX = 'arcana/';
const ARCANA_FILES = Array.from({ length: 22 }, (_, i) =>
  `${String(i + 1).padStart(2, '0')}.json`
);

/**
 * Converts nested ArcanaData structure to flat keys for template access.
 * 
 * NEW structure: arcana-data.json with nested arcana/combinations/karmaTexts
 * OUTPUT: Flat keys like:
 * - ARCANA_TREE.1 → arcana["1"].meaning
 * - ARCANA_TREE.YEAR_1 → combinations["1"].yearText
 * - ARCANA_TREE.MONTH_1_5 → combinations["1"].months["5"].monthText
 * - ARCANA_TREE.1_5_14 → combinations["1"].months["5"].days["14"]
 * - ARCANA_TREE.1_KARMA_POS → arcana["1"].karmaPos
 * - ARCANA_TREE.1_KARMA_NEG → arcana["1"].karmaNeg
 * - ARCANA_TREE.YEAR_NEG_KARMA → karmaTexts.yearNegKarma
 * - ARCANA_TREE.MONTH_NEG_KARMA → karmaTexts.monthNegKarma
 * - ARCANA_TREE.CALENDAR_NEG_KARMA → karmaTexts.calendarNegKarma
 */
function flattenArcanaData(data: ArcanaData): Record<string, string> {
  const flat: Record<string, string> = {};

  // Arcana meanings and karma texts
  for (const [arcanaNum, arcana] of Object.entries(data.arcana)) {
    flat[arcanaNum] = arcana.meaning;
    if (arcana.karmaPos) {
      flat[`${arcanaNum}_KARMA_POS`] = arcana.karmaPos;
    }
    if (arcana.karmaNeg) {
      flat[`${arcanaNum}_KARMA_NEG`] = arcana.karmaNeg;
    }
  }

  // Year, month, day combinations
  for (const [yearNum, yearData] of Object.entries(data.combinations)) {
    if (yearData.yearText) {
      flat[`YEAR_${yearNum}`] = yearData.yearText;
    }
    for (const [monthNum, monthData] of Object.entries(yearData.months)) {
      if (monthData.monthText) {
        flat[`MONTH_${yearNum}_${monthNum}`] = monthData.monthText;
      }
      for (const [dayNum, dayText] of Object.entries(monthData.days)) {
        flat[`${yearNum}_${monthNum}_${dayNum}`] = dayText;
      }
    }
  }

  // Karma warning texts
  if (data.karmaTexts.yearNegKarma) {
    flat['YEAR_NEG_KARMA'] = data.karmaTexts.yearNegKarma;
  }
  if (data.karmaTexts.monthNegKarma) {
    flat['MONTH_NEG_KARMA'] = data.karmaTexts.monthNegKarma;
  }
  if (data.karmaTexts.calendarNegKarma) {
    flat['CALENDAR_NEG_KARMA'] = data.karmaTexts.calendarNegKarma;
  }

  return flat;
}

/**
 * Merges 22 arcana files (01.json–22.json) into one ArcanaData.
 */
function mergeArcanaFiles(parts: ArcanaData[]): ArcanaData {
  const merged: ArcanaData = {
    arcana: {},
    combinations: {},
    karmaTexts: { yearNegKarma: '', monthNegKarma: '', calendarNegKarma: '' },
  };

  for (const part of parts) {
    Object.assign(merged.arcana, part.arcana);
    Object.assign(merged.combinations, part.combinations);
    if (part.karmaTexts?.yearNegKarma && !merged.karmaTexts.yearNegKarma) {
      merged.karmaTexts = part.karmaTexts;
    }
  }

  return merged;
}

/**
 * Custom TranslateLoader that merges main i18n translations with
 * arcana descriptions from arcana/{lang}/01.json through 22.json (nested structure per arcana).
 */
export class ArcanaTranslateLoader implements TranslateLoader {
  constructor(private readonly http: HttpClient) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    const main$ = this.http.get<TranslationObject>(
      `${I18N_PREFIX}${lang}.json`
    );

    const arcanaRequests = ARCANA_FILES.map((file) =>
      this.http.get<ArcanaData>(`${ARCANA_PREFIX}${lang}/${file}`)
    );

    return forkJoin([main$, ...arcanaRequests]).pipe(
      map(([main, ...arcanaParts]) => {
        const arcanaData = mergeArcanaFiles(arcanaParts);
        const arcanaTree = flattenArcanaData(arcanaData);
        return { ...main, ARCANA_TREE: arcanaTree } as TranslationObject;
      })
    );
  }
}
