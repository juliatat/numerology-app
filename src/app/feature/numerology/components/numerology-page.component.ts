import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {LIFE_PATH_DESCRIPTIONS} from '../../../core/models/life-path-descriptions';
import {NumerologyCalculateService} from '../services/numerology-calculation.service';

@Component({
  selector: 'app-numerology-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'numerology-page.component.html',
  styleUrl: 'numerology-page.component.scss'
})

export class NumerologyPageComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    birthDate: new FormControl('', Validators.required),
  });

  lifePathNumber?: number;
  lifePathDescription?: string;
  constructor(private numerologyService: NumerologyCalculateService) {}

  calculate() {
    if (!this.form.valid) return;

    const birthDate = new Date(this.form.value.birthDate!);
    this.lifePathNumber = this.numerologyService.calcLifePathNumber(birthDate);
    this.lifePathDescription = LIFE_PATH_DESCRIPTIONS[this.lifePathNumber] || '';
  }

}
