import { InjectionToken } from '@angular/core';
import {
    PasswordCreateModel,
    PasswordListItem,
    PasswordModel,
} from 'app/model/password.model';

export const PASSWORD_SERVICE = new InjectionToken<IPasswordService>(
    'PASSWORD_SERVICE',
);

export interface IPasswordService {
    getPasswords(): Promise<PasswordListItem[]>;
    getPassword(id: string): Promise<PasswordModel | undefined>;
    createPassword(model: PasswordCreateModel): Promise<PasswordModel>;
    updatePassword(model: PasswordModel): Promise<PasswordModel>;
    deletePassword(id: string): Promise<boolean>;
}
