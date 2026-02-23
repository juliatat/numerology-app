export interface ArcanaData {
  arcana: Record<string, ArcanaMeaning>;
  combinations: Record<string, YearCombination>;
  karmaTexts: {
    yearNegKarma: string;
    monthNegKarma: string;
    calendarNegKarma: string;
  };
}

export interface ArcanaMeaning {
  meaning: string;
  karmaPos?: string;
  karmaNeg?: string;
}

export interface YearCombination {
  yearText: string;
  months: Record<string, MonthCombination>;
}

export interface MonthCombination {
  monthText: string;
  days: Record<string, string>;
}
