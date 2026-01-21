import {Component, inject, Input, OnChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {DynamicTableComponent, TableColumn} from '../../../../shared/table/dynamic-table/dynamic-table';
import {KarmaCalculationService} from '../../services/karma-calculation.service';

@Component({
  selector: 'app-karma-block',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent, TranslateModule],
  templateUrl: './karma-block.component.html'
})
export class KarmaBlockComponent implements OnChanges {
  @Input() birthDate!: Date;
  private readonly karmaService = inject(KarmaCalculationService);

  tableColumns: TableColumn[] = [
    { key: 'positive', label: '+' },
    { key: 'negative', label: '-' },
  ];

  karmaTableData: Array<{ negative: number; positive: number }> = [];

  ngOnChanges(): void {
    if (!this.birthDate) {
      this.karmaTableData = [];
      return;
    }
    this.calculateKarma();
  }

  private calculateKarma(): void {
    if (!this.birthDate) return;
    const negative = this.karmaService.calculateNegative(this.birthDate);
    const positive = this.karmaService.calculatePositive(this.birthDate);

    const keys: Array<keyof typeof negative> = ['k1', 'k2', 'k3', 'k4', 'k5'];

    this.karmaTableData = keys.map(key => ({
      negative: negative[key],
      positive: positive[key],
    }));
  }

}
