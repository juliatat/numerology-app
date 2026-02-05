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

  readonly karmaMeta = this.data.contextMeta as KarmaContextMeta | undefined;
  readonly yearMeta = this.data.contextMeta as YearContextMeta | undefined;
  readonly monthMeta = this.data.contextMeta as MonthContextMeta | undefined;
  readonly calendarMeta = this.data.contextMeta as CalendarContextMeta | undefined;

  readonly descriptionKey = computed(() => {
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
