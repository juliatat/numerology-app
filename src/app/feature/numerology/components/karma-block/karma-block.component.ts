import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {DynamicTableComponent, TableColumn} from '../../../../shared/table/dynamic-table/dynamic-table';
import {KarmaCalculationService} from '../../services/karma-calculation.service';

@Component({
  selector: 'app-karma-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DynamicTableComponent, TranslateModule],
  templateUrl: './karma-block.component.html'
})
export class KarmaBlockComponent {
  readonly birthDate = input<Date | null>(null);
  private readonly karmaService = inject(KarmaCalculationService);

  readonly tableColumns: TableColumn[] = [
    { key: 'positive', label: '+' },
    { key: 'negative', label: '-' },
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

}
