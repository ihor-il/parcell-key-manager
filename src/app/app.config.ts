import {
    APP_INITIALIZER,
    ApplicationConfig,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { DatabaseService } from './services/database.service';
import { InitializeAppService } from './services/initialize.app.service';
import { SQLiteService } from './services/sqlite.service';

export function initializeFactory(init: InitializeAppService) {
    return () => init.initializeApp();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        SQLiteService,
        InitializeAppService,
        DatabaseService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeFactory,
            deps: [InitializeAppService],
            multi: true,
        },
    ],
};
