import { Injectable } from '@angular/core';
import { PasswordListItem, PasswordModel } from 'app/model/password.model';
import { IPasswordService } from 'app/services/password.service';
import { map, Observable, of, throwIfEmpty } from 'rxjs';
import { faker } from '@faker-js/faker';

@Injectable()
export class PasswordService implements IPasswordService {
    private readonly _passwords: Array<PasswordModel> = Array.from(
        { length: 50 },
        () => ({
            id: faker.string.uuid(),
            url: faker.internet.url({ protocol: undefined }),
            username: faker.internet.username(),
            password: faker.internet.password(),
        }),
    );

    constructor() {}

    getPasswords(): Observable<PasswordListItem[]> {
        return of(this._passwords);
    }

    getPassword(id: string): Observable<PasswordModel | undefined> {
        return of(this._passwords.find((p) => p.id === id));
    }
}
