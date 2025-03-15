import { Injectable } from '@angular/core';
import { PasswordListItem } from 'app/model/password-list-item.model';
import { IPasswordService } from 'app/services/password.service';
import { Observable, of } from 'rxjs';
import { faker } from '@faker-js/faker';

@Injectable()
export class PasswordService implements IPasswordService {
    constructor() {}

    getPasswords(): Observable<PasswordListItem[]> {
        const passwords = Array.from({ length: 10 }, () => ({
            url: faker.internet.url({ protocol: undefined }),
            username: faker.internet.username(),
        }));
        return of(passwords);
    }
}
