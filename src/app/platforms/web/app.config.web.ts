import { ApplicationConfig } from '@angular/core';
import { baseConfig } from 'app/app.config.base';
import { webProviders } from 'app/platforms/web/providers';

export const appConfig: ApplicationConfig = {
    providers: baseConfig.providers.concat(webProviders),
};
