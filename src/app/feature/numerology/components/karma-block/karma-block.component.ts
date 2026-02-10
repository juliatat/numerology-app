import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {DynamicTableComponent, TableColumn} from '../../../../shared/table/dynamic-table/dynamic-table';
import type {KarmaContextMeta, KarmaPeriodKey} from '../../models/arcana-modal.model';
import {KarmaCalculationService} from '../../services/karma-calculation.service';
import {ArcanaModalService} from '../../services/arcana-modal.service';

interface KarmaTableRow {
  id: KarmaPeriodKey;
  negative: number;
  positive: number;
}

@Component({
  selector: 'app-karma-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DynamicTableComponent, TranslateModule],
  templateUrl: './karma-block.component.html',
  styleUrl: './karma-block.component.scss',
})
export class KarmaBlockComponent {
  readonly birthDate = input<Date | null>(null);
  readonly lifePathNumber = input<number | null>(null);
  readonly negativeArcana = input<number[]>([]);
  private readonly karmaService = inject(KarmaCalculationService);
  private readonly arcanaModal = inject(ArcanaModalService);

  readonly tableColumns: TableColumn[] = [
    { key: 'positive', label: 'KARMA.POSITIVE_LABEL' },
    { key: 'negative', label: 'KARMA.NEGATIVE_LABEL' },
  ];

  readonly tableOrientation = 'vertical' as const;

  readonly karmaTableData = computed((): KarmaTableRow[] => {
    const birthDate = this.birthDate();
    if (!birthDate) return [];

    const negative = this.karmaService.calculateNegative(birthDate);
    const positive = this.karmaService.calculatePositive(birthDate);
    const keys: KarmaPeriodKey[] = ['k1', 'k2', 'k3', 'k4', 'k5'];

    return keys.map(id => ({
      id,
      negative: negative[id],
      positive: positive[id],
    }));
  });

  onCellClick(event: {row: KarmaTableRow; columnKey: string; value: unknown}): void {
    const arcane = Number(event.value);
    if (!Number.isInteger(arcane) || arcane < 1 || arcane > 22) return;
    const bd = this.birthDate();
    const lp = this.lifePathNumber();
    const periodKey = event.row.id;
    const contextMeta: KarmaContextMeta = {
      isPositive: event.columnKey === 'positive',
      periodKey,
      ...(bd !== null && lp !== null ? { birthYear: bd.getFullYear(), lifePathNumber: lp } : {}),
    };
    this.arcanaModal.openForPath([arcane], this.negativeArcana(), 'karma', contextMeta);
  }
}
