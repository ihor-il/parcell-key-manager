import { Provider } from '@angular/core';
import { PASSWORD_SERVICE } from 'app/services/password.service';
import { PasswordService } from './services/web-password.service';

export const webProviders: Provider[] = [
    { provide: PASSWORD_SERVICE, useClass: PasswordService },
];
