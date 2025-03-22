/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';
import { defineCustomElements as pwaElements } from '@ionic/pwa-elements/loader';

const platform = Capacitor.getPlatform();
if (platform === 'web') {
    pwaElements(window);
    jeepSqlite(window);

    window.addEventListener('DOMContentLoaded', async () => {
        const jeepEl = document.createElement('jeep-sqlite');
        document.body.appendChild(jeepEl);
        await customElements.whenDefined('jeep-sqlite');
        jeepEl.autoSave = true;
    });
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
    console.error(err),
);
