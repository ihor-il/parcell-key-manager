import { InjectionToken } from '@angular/core';
import { PasswordListItem, PasswordModel } from 'app/model/password.model';
import { Observable, of } from 'rxjs';

export const PASSWORD_SERVICE = new InjectionToken<IPasswordService>('PASSWORD_SERVICE');

export interface IPasswordService {
    getPasswords(): Observable<PasswordListItem[]>;
    getPassword(id: string): Observable<PasswordModel | undefined>;
}
