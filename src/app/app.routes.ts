import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: 'acces-refuse',
    loadComponent: () =>
      import('./pages/acces-refuse/acces-refuse.component').then(m => m.AccesRefuseComponent)
  },
  {
    path: 'articles',
    loadComponent: () =>
      import('./pages/articles.component').then(m => m.ArticlesPage),
    canActivate: [MsalGuard, roleGuard],
    data: { roles: ['Task.Reader', 'Task.Writer'] }
  },
  {
    path: 'nouveau',
    loadComponent: () =>
      import('./pages/new-article.component').then(m => m.NewArticlePage),
    canActivate: [MsalGuard, roleGuard],
    data: { roles: ['Task.Writer'] }
  },
  {
    path: 'mes-articles',
    loadComponent: () => import('./pages/articles.component').then(m => m.ArticlesPage),
    canActivate: [MsalGuard, roleGuard],
    data: { roles: ['Task.Reader', 'Task.Writer'] }
  },
  { path: '', pathMatch: 'full', redirectTo: '' },

  { path: '**', redirectTo: '' }
];
