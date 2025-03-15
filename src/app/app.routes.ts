import { Routes } from '@angular/router';
import { mainRoutes } from './pages/main/main.routes';

export const routes: Routes = [
    {
        path: 'app',
        loadComponent: () =>
            import('app/pages/main/main.component').then((m) => m.MainComponent),
        children: mainRoutes
    },
    {
        path: '**',
        redirectTo: 'app',
    },
];
