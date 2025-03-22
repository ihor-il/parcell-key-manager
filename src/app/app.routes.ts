import { Routes } from '@angular/router';
import { mainRoutes } from './pages/main/main.routes';

export const routes: Routes = [
    {
        path: 'app',
        loadComponent: () =>
            import('app/pages/main/main.page.component').then((m) => m.MainPageComponent),
        children: mainRoutes
    },
    {
        path: 'login',
        loadComponent: () => import('app/pages/login/login.page.component').then(m => m.LoginPageComponent)
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
