#!/usr/bin/env node
/**
 * Extracts ARCANA_TREE from en.json and ru.json into arcana/en/ and arcana/ru/
 * directories. One file per Major Arcana (01.json through 22.json).
 * Preserves all existing texts exactly.
 * Run: node scripts/extract-arcana-translations.js
 */

const fs = require('fs');
const path = require('path');

const I18N_DIR = path.join(__dirname, '../public/i18n');
const ARCANA_DIR = path.join(__dirname, '../public/arcana');

/**
 * Returns the arcana file index (1-22) for a given ARCANA_TREE key.
 * Keys are assigned by the first arcana number in the key.
 * Shared keys (YEAR_NEG_KARMA, etc.) go to file 01.
 */
function getArcanaFileIndex(key) {
  if (key === 'YEAR_NEG_KARMA' || key === 'MONTH_NEG_KARMA' || key === 'CALENDAR_NEG_KARMA') {
    return 1;
  }
  const rootMatch = key.match(/^(\d{1,2})$/);
  if (rootMatch) return parseInt(rootMatch[1], 10);
  const yearMatch = key.match(/^YEAR_(\d{1,2})$/);
  if (yearMatch) return parseInt(yearMatch[1], 10);
  const karmaMatch = key.match(/^(\d{1,2})_KARMA/);
  if (karmaMatch) return parseInt(karmaMatch[1], 10);
  const monthMatch = key.match(/^MONTH_(\d{1,2})_\d{1,2}$/);
  if (monthMatch) return parseInt(monthMatch[1], 10);
  const dayMatch = key.match(/^(\d{1,2})_\d{1,2}_\d{1,2}$/);
  if (dayMatch) return parseInt(dayMatch[1], 10);
  return 1;
}

function extractAndSplit(lang) {
  const filePath = path.join(I18N_DIR, `${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const arcanaTree = content.ARCANA_TREE;
  if (!arcanaTree) {
    throw new Error(`ARCANA_TREE not found in ${filePath}`);
  }

  const files = {};
  for (let i = 1; i <= 22; i++) {
    files[i] = {};
  }

  for (const [key, value] of Object.entries(arcanaTree)) {
    const idx = getArcanaFileIndex(key);
    files[idx][key] = value;
  }

  return files;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function removeArcanaTreeFromMain(lang) {
  const filePath = path.join(I18N_DIR, `${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  delete content.ARCANA_TREE;
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
}

function main() {
  const enFiles = extractAndSplit('en');
  const ruFiles = extractAndSplit('ru');

  for (const lang of ['en', 'ru']) {
    const files = lang === 'en' ? enFiles : ruFiles;
    const langDir = path.join(ARCANA_DIR, lang);
    fs.mkdirSync(langDir, { recursive: true });

    for (let i = 1; i <= 22; i++) {
      const fileName = `${pad(i)}.json`;
      const filePath = path.join(langDir, fileName);
      const data = files[i];
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    }
  }

  removeArcanaTreeFromMain('en');
  removeArcanaTreeFromMain('ru');

  console.log('Extracted ARCANA_TREE to public/arcana/en/ and public/arcana/ru/');
  console.log('Removed ARCANA_TREE from en.json and ru.json');
}

main();
