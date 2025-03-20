import { Routes } from '@angular/router';

export const mainRoutes: Routes = [
    {
        path: '2fa',
        loadComponent: () =>
            import(
                'app/pages/two-factor-auth/two-factor-auth.page.component'
            ).then((m) => m.TwoFactorAuthComponent),
    },
    {
        path: 'passwords',
        loadComponent: () =>
            import('app/pages/password-list/password-list.page.component').then(
                (m) => m.PasswordListPageComponent,
            ),
    },
    {
        path: 'settings',
        loadComponent: () =>
            import('app/pages/settings/settings.page.component').then(
                (m) => m.SettingsComponent,
            ),
    },
    {
        path: '',
        redirectTo: 'passwords',
        pathMatch: 'full',
    },
];
