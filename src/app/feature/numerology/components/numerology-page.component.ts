import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import {NumerologyCalculateService} from '../services/numerology-calculation.service';
import {TranslateModule} from '@ngx-translate/core';
import {LifePathNumber} from '../../../core/models/numerology-types';
import {DynamicTableComponent, TableColumn} from '../../../shared/table/dynamic-table/dynamic-table';

@Component({
  selector: 'app-numerology-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    DynamicTableComponent
  ],
  templateUrl: 'numerology-page.component.html',
  styleUrl: 'numerology-page.component.scss'
})

export class NumerologyPageComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    birthDate: new FormControl('', Validators.required),
  });

  lifePathNumber?: LifePathNumber;
  tableColumns: TableColumn[] = [
    {key: 'positive', label: 'NUMEROLOGY.TABLE.POSITIVE'},
    {key: 'negative', label: 'NUMEROLOGY.TABLE.NEGATIVE'},
  ];

  //for test
  tableData: any[] = [{positive: 1, negative: 11}, {positive: 1, negative: 11}, {
    positive: 5,
    negative: 55
  }, {positive: 2, negative: 21}, {positive: 3, negative: 44}, {positive: 1, negative: 11}];

  constructor(private numerologyService: NumerologyCalculateService) {
  }

  calculate(): void {
    const birthDate = this.form.get('birthDate')?.value;
    if (!birthDate) return;

    const lifePath = this.numerologyService.calculateLifePathNumber(birthDate);
    this.lifePathNumber = lifePath;
  }

}
