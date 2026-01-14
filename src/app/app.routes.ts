import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'numerology', pathMatch: 'full' },
  {
    path: 'numerology',
    loadComponent: () =>
      import('./feature/numerology/components/numerology-page.component').then(
        (c) => c.NumerologyPageComponent
      ),
  },
  ];

