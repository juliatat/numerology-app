import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import {NumerologyCalculateService} from '../services/numerology-calculation.service';
import {TranslateModule} from '@ngx-translate/core';
import {LifePathNumber} from '../../../core/models/numerology-types';
import {KarmaBlockComponent} from './karma-block/karma-block.component';
import {YearlyPrognosticsComponent} from './yearly-prognostics/yearly-prognostics.component';
import {MonthlyPrognosticsComponent} from './monthly-prognostics/monthly-prognostics.component';

@Component({
  selector: 'app-numerology-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    KarmaBlockComponent,
    YearlyPrognosticsComponent,
    MonthlyPrognosticsComponent
  ],
  templateUrl: 'numerology-page.component.html',
  styleUrl: 'numerology-page.component.scss'
})

export class NumerologyPageComponent {
  isSubmitted = false;
  lifePathNumber?: LifePathNumber;
  selectedYear: number = new Date().getFullYear();

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    birthDate: new FormControl('', Validators.required),
  });

  constructor(private numerologyService: NumerologyCalculateService) {
  }

  get birthDate() {
    const value = this.form.value.birthDate;
    return value ? new Date(value) : null;
  }

  calculate(): void {
    const birthDate = this.form.get('birthDate')?.value;
    if (!birthDate) return;

    this.isSubmitted = true;
    const lifePath = this.numerologyService.calculateLifePathNumber(birthDate);
    this.lifePathNumber = lifePath;
  }

}
