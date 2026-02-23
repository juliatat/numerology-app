export type ArcanaModalContext = 'karma' | 'year' | 'month' | 'calendar';

export type KarmaPeriodKey = 'k1' | 'k2' | 'k3' | 'k4' | 'k5';

export interface KarmaContextMeta {
  isPositive: boolean;
  /** Which row was clicked: k1..k5. Used to show only that period's years. */
  periodKey?: KarmaPeriodKey;
  birthYear?: number;
  lifePathNumber?: number;
}

export interface YearContextMeta {
  year: number;
  /** Calculated year arcana (formula for this year). */
  positiveArcana: number;
  negativeArcana: number;
  /** Lived/active year arcana (before birthday = previous year's energy). */
  activePositiveArcana: number;
  activeNegativeArcana: number;
  isBeforeBirthday: boolean;
}

export interface MonthContextMeta {
  month: number;
  monthArcana: number;
  /** Calculated year arcana for display. */
  calculatedYearArcana: number;
  /** Lived year arcana (used in path and for combinations). */
  yearArcana: number;
  isBeforeBirthday: boolean;
}

export interface CalendarContextMeta {
  day: number;
  month: number;
  year: number;
  dayArcana: number;
  monthArcana: number;
  /** Calculated year arcana for display. */
  calculatedYearArcana: number;
  /** Lived year arcana (used in path and for combinations). */
  yearArcana: number;
  isBeforeBirthday: boolean;
}

/** Single description from a matched path in the tree. One per path, no aggregation. */
export interface ArcanaPathDescription {
  baseDescription: string;
  /** Shown when year context (path length 2) – standalone year arcana meaning */
  yearDescription?: string;
  /** Shown when month context (path length 2) – year + month combination */
  monthDescription?: string;
  /** Shown when karma context and positive column */
  karmaPositiveDescription?: string;
  /** Shown when karma context and negative column */
  karmaNegativeDescription?: string;
  /** Shown when path matches negative karma list (arcana 13, 14, 16, 19) */
  negativeKarmaExtraDescription?: string;
}

/** Tree node with _self and optional child nodes keyed by arcana id (1-22) */
export interface ArcanaTreeNode {
  _self: ArcanaPathDescription;
  [key: string]: ArcanaPathDescription | ArcanaTreeNode | undefined;
}

/** Root of arcana tree: keys 1-22 map to nodes */
export type ArcanaTreeRoot = Record<string, ArcanaTreeNode>;

/** Ready data for the arcana modal. Modal does not compute; receives pre-computed values. */
export interface ArcanaModalReadyData {
  /** Ordered arcana path (order matters: 1-2-3 ≠ 1-3-2) */
  arcana: number[];
  /** Single description from getDescriptionByPath, or null if no match */
  description: ArcanaPathDescription | null;
  /** Whether path contains any arcana from negative karma list */
  hasNegativeKarma: boolean;
  context: ArcanaModalContext;
  contextMeta?: KarmaContextMeta | YearContextMeta | MonthContextMeta | CalendarContextMeta;
}
