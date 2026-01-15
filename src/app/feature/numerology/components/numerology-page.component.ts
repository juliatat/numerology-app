import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import {NumerologyCalculateService} from '../services/numerology-calculation.service';
import {TranslateModule} from '@ngx-translate/core';
import {LifePathNumber} from '../../../core/models/numerology-types';

@Component({
  selector: 'app-numerology-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
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

  constructor(private numerologyService: NumerologyCalculateService) {
  }

  calculate(): void {
    const birthDate = this.form.get('birthDate')?.value;
    if (!birthDate) return;

    const lifePath = this.numerologyService.calculateLifePathNumber(birthDate);
    this.lifePathNumber = lifePath;
  }

}
