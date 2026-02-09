import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./feature/numerology/components/numerology-page.component').then(
        (c) => c.NumerologyPageComponent
      ),
  },
  { path: 'numerology', redirectTo: '', pathMatch: 'full' },
];

