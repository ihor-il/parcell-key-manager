import {
    APP_INITIALIZER,
    ApplicationConfig,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { DbnameVersionService } from './services/dbname-version.service';
import { InitializeAppService } from './services/initialize.app.service';
import { PasswordService } from './services/password.service';
import { SQLiteService } from './services/sqlite.service';

export function initializeFactory(init: InitializeAppService) {
    return () => init.initializeApp();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        SQLiteService,
        DbnameVersionService,
        InitializeAppService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeFactory,
            deps: [InitializeAppService],
            multi: true,
        },

        PasswordService,
    ],
};
