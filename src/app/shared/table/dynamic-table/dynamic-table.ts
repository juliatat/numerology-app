import {ChangeDetectionStrategy, Component, computed, effect, input, viewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {TranslateModule} from '@ngx-translate/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableRowBase {
  id: string | number;
}

@Component({
  selector: 'app-dynamic-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    TranslateModule
  ],
  templateUrl: './dynamic-table.html',
  styleUrls: ['./dynamic-table.scss']
})
export class DynamicTableComponent<T extends TableRowBase & Record<string, unknown>> {
  readonly columns = input<TableColumn[]>([]);
  readonly data = input<T[]>([]);
  readonly pageSize = input(5);
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  readonly displayedColumns = computed(() => this.columns().map(c => c.key));

  readonly dataSource = new MatTableDataSource<T>([]);

  private readonly paginator = viewChild(MatPaginator);

  constructor() {
    effect(() => {
      this.dataSource.data = this.data();
    });

    effect(() => {
      const paginator = this.paginator();
      if (paginator) {
        this.dataSource.paginator = paginator;
      }
    });
  }
}
