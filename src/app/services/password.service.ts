import { InjectionToken } from '@angular/core';
import { PasswordListItem } from 'app/model/password-list-item.model';
import { Observable, of } from 'rxjs';

export const PASSWORD_SERVICE = new InjectionToken<IPasswordService>('PASSWORD_SERVICE');

export interface IPasswordService {
    getPasswords(): Observable<PasswordListItem[]>;
}
