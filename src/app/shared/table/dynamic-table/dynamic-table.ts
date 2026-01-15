import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableDataSource} from '@angular/material/table';
import {TranslateModule} from '@ngx-translate/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './dynamic-table.html',
  styleUrls: ['./dynamic-table.scss']
})
export class DynamicTableComponent<T> implements OnInit {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() pageSize = 5;

  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<T>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.displayedColumns = this.columns.map(c => c.key);
    this.dataSource = new MatTableDataSource(this.data);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // ✅ привязка пагинатора
  }

  sortData(event: any) {
    const sortKey = event.active;
    const direction = event.direction;
    this.dataSource.data = [...this.dataSource.data].sort((a: any, b: any) => {
      if (!direction) return 0;
      return (a[sortKey] > b[sortKey] ? 1 : -1) * (direction === 'asc' ? 1 : -1);
    });
  }


}
