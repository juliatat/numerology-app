#!/usr/bin/env node
/**
 * Generates arcana-tree.json and ARCANA_TREE translations for en.json and ru.json.
 * Run: node scripts/generate-arcana-tree.js
 */

const fs = require('fs');
const path = require('path');

const ARCANA_NAMES = {
  en: {
    1: 'Magician',
    2: 'High Priestess',
    3: 'Empress',
    4: 'Emperor',
    5: 'Hierophant',
    6: 'Lovers',
    7: 'Chariot',
    8: 'Strength',
    9: 'Hermit',
    10: 'Wheel of Fortune',
    11: 'Justice',
    12: 'Hanged Man',
    13: 'Death',
    14: 'Temperance',
    15: 'Devil',
    16: 'Tower',
    17: 'Star',
    18: 'Moon',
    19: 'Sun',
    20: 'Judgement',
    21: 'World',
    22: 'Fool',
  },
  ru: {
    1: 'Маг',
    2: 'Верховная Жрица',
    3: 'Императрица',
    4: 'Император',
    5: 'Иерофант',
    6: 'Влюблённые',
    7: 'Колесница',
    8: 'Сила',
    9: 'Отшельник',
    10: 'Колесо Фортуны',
    11: 'Справедливость',
    12: 'Повешенный',
    13: 'Смерть',
    14: 'Умеренность',
    15: 'Дьявол',
    16: 'Башня',
    17: 'Звезда',
    18: 'Луна',
    19: 'Солнце',
    20: 'Суд',
    21: 'Мир',
    22: 'Шут',
  },
};

const ARCANA_THEMES = {
  en: {
    1: 'creativity and action',
    2: 'intuition and wisdom',
    3: 'growth and nurturing',
    4: 'structure and stability',
    5: 'tradition and teaching',
    6: 'love and choice',
    7: 'victory and determination',
    8: 'courage and inner power',
    9: 'wisdom and introspection',
    10: 'cycles and destiny',
    11: 'justice and balance',
    12: 'sacrifice and renewal',
    13: 'transformation and rebirth',
    14: 'balance and moderation',
    15: 'material focus and shadow',
    16: 'sudden change and revelation',
    17: 'hope and inspiration',
    18: 'illusion and intuition',
    19: 'joy and vitality',
    20: 'awakening and renewal',
    21: 'completion and wholeness',
    22: 'new beginnings and spontaneity',
  },
  ru: {
    1: 'творчество и действие',
    2: 'интуиция и мудрость',
    3: 'рост и забота',
    4: 'структура и стабильность',
    5: 'традиция и наставничество',
    6: 'любовь и выбор',
    7: 'победа и решимость',
    8: 'мужество и внутренняя сила',
    9: 'мудрость и самонаблюдение',
    10: 'циклы и судьба',
    11: 'справедливость и баланс',
    12: 'жертва и обновление',
    13: 'трансформация и возрождение',
    14: 'баланс и умеренность',
    15: 'материальный фокус и тень',
    16: 'внезапные перемены и откровение',
    17: 'надежда и вдохновение',
    18: 'иллюзия и интуиция',
    19: 'радость и жизненная сила',
    20: 'пробуждение и обновление',
    21: 'завершение и целостность',
    22: 'новые начала и спонтанность',
  },
};

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function rootDescription(theme) {
  return capitalize(theme) + '.';
}

const KARMA_POS = {
  1: 'Positive influence: Strong will and initiative support your goals. Opportunities for leadership and manifesting desires.',
  2: 'Positive influence: Inner wisdom guides you. Trust your instincts and seek quiet reflection.',
  3: 'Positive influence: Creative abundance and nurturing energy. Fertile ground for ideas and relationships.',
  4: 'Positive influence: Solid foundations and discipline. Build lasting structures in your life.',
  5: 'Positive influence: Spiritual guidance and established wisdom. Learn from mentors and traditions.',
  6: 'Positive influence: Harmony in relationships. Alignment of heart and values brings union.',
  7: 'Positive influence: Willpower overcomes obstacles. Stay focused and determined.',
  8: 'Positive influence: Taming inner shadows. Compassion and strength work together.',
  9: 'Positive influence: Inner search yields truth. Solitude brings clarity.',
  10: 'Positive influence: Change brings growth. Trust the turning of fate.',
  11: 'Positive influence: Karmic balance and fairness. Truth prevails.',
  12: 'Positive influence: Letting go creates space. New perspective emerges.',
  13: 'Positive influence: Necessary endings lead to renewal. Embrace change.',
  14: 'Positive influence: Alchemy of opposites. Blend extremes into harmony.',
  15: 'Positive influence: Awareness of attachments. Freedom through understanding.',
  16: 'Positive influence: Illusions break for truth. Disruption serves awakening.',
  17: 'Positive influence: Light after darkness. Faith and renewal guide you.',
  18: 'Positive influence: Navigate the unknown. Trust subtle guidance.',
  19: 'Positive influence: Success and clarity. Openness brings abundance.',
  20: 'Positive influence: Inner calling and life review. Higher purpose revealed.',
  21: 'Positive influence: Integration of all experiences. Fulfillment and closure.',
  22: 'Positive influence: Leap into the unknown. Trust and innocence serve you.',
};

const KARMA_NEG = {
  1: 'Challenges: Overconfidence or impatience may block progress. Practice humility and consider others.',
  2: 'Challenges: Indecision or ignoring your intuition. Avoid passivity; balance receptivity with action.',
  3: 'Challenges: Over-giving or creative blocks. Set boundaries and nurture yourself first.',
  4: 'Challenges: Rigidity or excessive control. Allow flexibility and trust the process.',
  5: 'Challenges: Dogmatism or resistance to change. Stay open to new perspectives.',
  6: 'Challenges: Indecision in love or imbalance. Choose with clarity and self-respect.',
  7: 'Challenges: Aggression or forcing outcomes. Channel strength with patience.',
  8: 'Challenges: Fear or suppressed power. Face what you avoid with courage.',
  9: 'Challenges: Isolation or escapism. Balance solitude with connection.',
  10: 'Challenges: Resistance to change or victim mentality. Accept cycles and take responsibility.',
  11: 'Challenges: Imbalance or unfairness. Act with integrity and accept consequences.',
  12: 'Challenges: Martyrdom or inability to release. Surrender with wisdom, not despair.',
  13: 'Challenges: Fear of change or clinging to the past. Release what no longer serves.',
  14: 'Challenges: Excess or imbalance. Practice moderation in all things.',
  15: 'Challenges: Material obsession or temptation. Recognize the chains you choose.',
  16: 'Challenges: Crisis or resistance to truth. Accept revelation with humility.',
  17: 'Challenges: False hope or despair. Ground inspiration in realistic action.',
  18: 'Challenges: Deception or confusion. Discern illusion from truth.',
  19: 'Challenges: Ego inflation or superficial joy. Share success with humility.',
  20: 'Challenges: Resistance to awakening. Answer the call with courage.',
  21: 'Challenges: Incompletion or clinging to cycles. Honor endings and new beginnings.',
  22: 'Challenges: Recklessness or fear of the new. Balance spontaneity with discernment.',
};

const KARMA_EXTRA = {
  13: 'Karmic debt: Laziness, avoiding work and responsibility. Learn to act with discipline.',
  14: 'Karmic debt: Excessive freedom, impulsiveness, inability to control desires.',
  16: 'Karmic debt: Breaking illusions, crises, excessive pride.',
  19: 'Karmic debt: Egoism, excessive focus on oneself.',
};

const NEG_KARMA_EXTRA = {
  en: {
    YEAR: 'One or more arcana in this year match your negative karma. Pay attention to lessons and avoid repeating old patterns.',
    MONTH: 'One or more arcana in this month match your negative karma. Use this period for conscious growth and healing.',
    CALENDAR: 'One or more arcana on this day match your negative karma. A constructive warning: stay mindful and choose wisely.',
  },
  ru: {
    YEAR: 'Один или более арканов в этом году совпадают с твоей негативной кармой. Обрати внимание на уроки и избегай повторения старых паттернов.',
    MONTH: 'Один или более арканов в этом месяце совпадают с твоей негативной кармой. Используй этот период для осознанного роста и исцеления.',
    CALENDAR: 'Один или более арканов в этот день совпадают с твоей негативной кармой. Конструктивное предупреждение: оставайся внимательным и выбирай мудро.',
  },
};

const YEAR_TEMPLATES = {
  en: (name, theme) =>
    `The year carries the energy of ${name}. ${capitalize(theme)} shapes the annual cycle.`,
  ru: (name, theme) =>
    `Год несёт энергию ${name}. ${capitalize(theme)} формирует годовой цикл.`,
};

const MONTH_TEMPLATES = {
  en: (mName, yName, mTheme, yTheme) =>
    `The combination of ${mName} and ${yName} describes a period where ${mTheme} meets ${yTheme}—a unified interpretation of the month within the year's flow.`,
  ru: (mName, yName, mTheme, yTheme) =>
    `Сочетание ${mName} и ${yName} описывает период, где ${mTheme} встречается с ${yTheme} — единая интерпретация месяца в потоке года.`,
};

const DAY_TEMPLATES = {
  en: (d, m, y, dTheme, mTheme, yTheme) =>
    `${d} – ${m} – ${y}: This combination represents the interplay of ${dTheme}, ${mTheme}, and ${yTheme} as a complete destiny program for the day.`,
  ru: (d, m, y, dTheme, mTheme, yTheme) =>
    `${d} – ${m} – ${y}: Это сочетание представляет взаимодействие ${dTheme}, ${mTheme} и ${yTheme} как полную программу судьбы дня.`,
};

function buildTree() {
  const tree = {};

  for (let a = 1; a <= 22; a++) {
    const node = {
      _self: {
        baseDescription: `ARCANA_TREE.${a}`,
        karmaPositiveDescription: `ARCANA_TREE.${a}_KARMA_POS`,
        karmaNegativeDescription: `ARCANA_TREE.${a}_KARMA_NEG`,
      },
    };

    if (KARMA_EXTRA[a]) {
      node._self.negativeKarmaExtraDescription = 'ARCANA_TREE.' + a + '_KARMA';
    }

    for (let b = 1; b <= 22; b++) {
      node[b] = {
        _self: {
          baseDescription: `ARCANA_TREE.MONTH_${a}_${b}`,
          yearDescription: `ARCANA_TREE.YEAR_${a}`,
          monthDescription: `ARCANA_TREE.MONTH_${a}_${b}`,
          negativeKarmaExtraDescription: 'ARCANA_TREE.YEAR_NEG_KARMA',
        },
      };
      for (let c = 1; c <= 22; c++) {
        node[b][c] = {
          _self: {
            baseDescription: `ARCANA_TREE.${a}_${b}_${c}`,
            negativeKarmaExtraDescription: 'ARCANA_TREE.CALENDAR_NEG_KARMA',
          },
        };
      }
    }

    tree[String(a)] = node;
  }

  return tree;
}

function buildTranslations(locale) {
  const names = ARCANA_NAMES[locale];
  const themes = ARCANA_THEMES[locale];
  const yearTpl = YEAR_TEMPLATES[locale];
  const monthTpl = MONTH_TEMPLATES[locale];
  const dayTpl = DAY_TEMPLATES[locale];
  const negKarma = NEG_KARMA_EXTRA[locale];

  const translations = {};

  if (locale === 'en') {
    for (let a = 1; a <= 22; a++) {
      translations[`${a}`] = rootDescription(themes[a]);
      translations[`${a}_KARMA_POS`] = KARMA_POS[a];
      translations[`${a}_KARMA_NEG`] = KARMA_NEG[a];
    }
    translations['13_KARMA'] = KARMA_EXTRA[13];
    translations['14_KARMA'] = KARMA_EXTRA[14];
    translations['16_KARMA'] = KARMA_EXTRA[16];
    translations['19_KARMA'] = KARMA_EXTRA[19];
  }

  for (let a = 1; a <= 22; a++) {
    const theme = themes[a];
    const name = names[a];
    translations[`YEAR_${a}`] = yearTpl(name, theme);
  }

  for (let m = 1; m <= 22; m++) {
    for (let y = 1; y <= 22; y++) {
      translations[`MONTH_${m}_${y}`] = monthTpl(
        names[m],
        names[y],
        themes[m],
        themes[y]
      );
    }
  }

  for (let d = 1; d <= 22; d++) {
    for (let m = 1; m <= 22; m++) {
      for (let y = 1; y <= 22; y++) {
        translations[`${d}_${m}_${y}`] = dayTpl(
          d,
          m,
          y,
          themes[d],
          themes[m],
          themes[y]
        );
      }
    }
  }

  translations['YEAR_NEG_KARMA'] = negKarma.YEAR;
  translations['MONTH_NEG_KARMA'] = negKarma.MONTH;
  translations['CALENDAR_NEG_KARMA'] = negKarma.CALENDAR;

  return translations;
}

function getReferencedKeys() {
  const keys = new Set();
  for (let a = 1; a <= 22; a++) {
    keys.add(String(a));
    keys.add(`${a}_KARMA_POS`);
    keys.add(`${a}_KARMA_NEG`);
  }
  Object.keys(KARMA_EXTRA).forEach(a => keys.add(`${a}_KARMA`));
  for (let a = 1; a <= 22; a++) keys.add(`YEAR_${a}`);
  for (let m = 1; m <= 22; m++) {
    for (let y = 1; y <= 22; y++) keys.add(`MONTH_${m}_${y}`);
  }
  for (let d = 1; d <= 22; d++) {
    for (let m = 1; m <= 22; m++) {
      for (let y = 1; y <= 22; y++) keys.add(`${d}_${m}_${y}`);
    }
  }
  keys.add('YEAR_NEG_KARMA').add('MONTH_NEG_KARMA').add('CALENDAR_NEG_KARMA');
  return keys;
}

function main() {
  const tree = buildTree();
  const treePath = path.join(__dirname, '../public/feature/numerology/data/arcana-tree.json');
  fs.writeFileSync(treePath, JSON.stringify(tree, null, 2), 'utf8');
  console.log('Written:', treePath);

  const validKeys = getReferencedKeys();
  const filterToValid = obj => {
    const out = {};
    for (const k of Object.keys(obj)) {
      if (validKeys.has(k)) out[k] = obj[k];
    }
    return out;
  };

  const enTranslations = buildTranslations('en');
  const enPath = path.join(__dirname, '../public/i18n/en.json');
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  en.ARCANA_TREE = filterToValid({ ...enTranslations, ...en.ARCANA_TREE });
  fs.writeFileSync(enPath, JSON.stringify(en, null, 2), 'utf8');
  console.log('Updated:', enPath);

  const ruTranslations = buildTranslations('ru');
  const ruPath = path.join(__dirname, '../public/i18n/ru.json');
  const ru = JSON.parse(fs.readFileSync(ruPath, 'utf8'));
  ru.ARCANA_TREE = filterToValid({ ...ruTranslations, ...ru.ARCANA_TREE });
  fs.writeFileSync(ruPath, JSON.stringify(ru, null, 2), 'utf8');
  console.log('Updated:', ruPath);
}

main();
