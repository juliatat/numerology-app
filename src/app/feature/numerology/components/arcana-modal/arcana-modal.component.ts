import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {TranslateModule} from '@ngx-translate/core';
import type {
  ArcanaModalReadyData,
  KarmaContextMeta,
  YearContextMeta,
  MonthContextMeta,
  CalendarContextMeta,
} from '../../models/arcana-modal.model';
import {KarmaPeriodsService} from '../../services/karma-periods.service';
import type {KarmaPeriodsResult} from '../../services/karma-periods.service';

@Component({
  selector: 'app-arcana-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  templateUrl: './arcana-modal.component.html',
  styleUrl: './arcana-modal.component.scss',
})
export class ArcanaModalComponent {
  readonly data = inject<ArcanaModalReadyData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ArcanaModalComponent>);
  private readonly karmaPeriodsService = inject(KarmaPeriodsService);

  readonly arcanaPath = computed(() => this.data.arcana.join('-'));
  readonly karmaMeta = this.data.contextMeta as KarmaContextMeta | undefined;
  readonly yearMeta = this.data.contextMeta as YearContextMeta | undefined;
  readonly monthMeta = this.data.contextMeta as MonthContextMeta | undefined;
  readonly calendarMeta = this.data.contextMeta as CalendarContextMeta | undefined;

  readonly karmaPeriods = computed<KarmaPeriodsResult | null>(() => {
    if (this.data.context !== 'karma' || !this.karmaMeta?.birthYear || !this.karmaMeta?.lifePathNumber) {
      return null;
    }
    return this.karmaPeriodsService.getPeriods(this.karmaMeta.birthYear, this.karmaMeta.lifePathNumber);
  });

  /** Single period line for the clicked row (k1–k4). k5 has no date range. */
  readonly karmaPeriodLine = computed<{ years: string; isK4: boolean } | null>(() => {
    const periods = this.karmaPeriods();
    const key = this.karmaMeta?.periodKey;
    if (!periods || !key || key === 'k5') return null;
    if (key === 'k4') {
      return { years: String(periods.k4StartYear), isK4: true };
    }
    return { years: periods[key], isK4: false };
  });

  readonly descriptionKey = computed<string | null>(() => {
    const desc = this.data.description;
    if (!desc) return null;
    if (this.data.context === 'karma' && this.karmaMeta) {
      return this.karmaMeta.isPositive
        ? (desc.karmaPositiveDescription ?? desc.baseDescription)
        : (desc.karmaNegativeDescription ?? desc.baseDescription);
    }
    if (this.data.context === 'year' && desc.yearDescription) {
      return desc.yearDescription;
    }
    if (this.data.context === 'month' && desc.monthDescription) {
      return desc.monthDescription;
    }
    return desc.baseDescription;
  });

  close(): void {
    this.dialogRef.close();
  }
}
