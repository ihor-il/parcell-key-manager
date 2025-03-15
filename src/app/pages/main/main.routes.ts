import { Routes } from '@angular/router';

export const mainRoutes: Routes = [
    {
        path: '2fa',
        loadComponent: () =>
            import('app/pages/two-factor-auth/two-factor-auth.component').then(
                (m) => m.TwoFactorAuthComponent
            ),
    },
    {
        path: 'passwords',
        loadComponent: () =>
            import('app/pages/passwords/passwords.page.component').then(
                (m) => m.PasswordsPageComponent
            ),
    },
    {
        path: 'settings',
        loadComponent: () =>
            import('app/pages/settings/settings.component').then(
                (m) => m.SettingsComponent
            ),
    },
    {
        path: '',
        redirectTo: 'passwords',
        pathMatch: 'full'
    }
];
