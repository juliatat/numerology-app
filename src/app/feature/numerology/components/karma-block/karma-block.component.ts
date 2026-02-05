import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {DynamicTableComponent, TableColumn} from '../../../../shared/table/dynamic-table/dynamic-table';
import {KarmaCalculationService} from '../../services/karma-calculation.service';
import {ArcanaModalService} from '../../services/arcana-modal.service';

@Component({
  selector: 'app-karma-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DynamicTableComponent, TranslateModule],
  templateUrl: './karma-block.component.html',
  styleUrl: './karma-block.component.scss',
})
export class KarmaBlockComponent {
  readonly birthDate = input<Date | null>(null);
  readonly negativeArcana = input<number[]>([]);
  private readonly karmaService = inject(KarmaCalculationService);
  private readonly arcanaModal = inject(ArcanaModalService);

  readonly tableColumns: TableColumn[] = [
    { key: 'positive', label: 'KARMA.POSITIVE_LABEL' },
    { key: 'negative', label: 'KARMA.NEGATIVE_LABEL' },
  ];

  readonly karmaTableData = computed((): Array<{ id: string; negative: number; positive: number }> => {
    const birthDate = this.birthDate();
    if (!birthDate) return [];

    const negative = this.karmaService.calculateNegative(birthDate);
    const positive = this.karmaService.calculatePositive(birthDate);

    const keys: Array<keyof typeof negative> = ['k1', 'k2', 'k3', 'k4', 'k5'];

    return keys.map(key => ({
      id: key,
      negative: negative[key],
      positive: positive[key],
    }));
  });

  onCellClick(event: {row: {id: string; negative: number; positive: number}; columnKey: string; value: unknown}): void {
    const arcane = Number(event.value);
    if (!Number.isInteger(arcane) || arcane < 1 || arcane > 22) return;
    this.arcanaModal.openForPath(
      [arcane],
      this.negativeArcana(),
      'karma',
      {isPositive: event.columnKey === 'positive'}
    );
  }
}
