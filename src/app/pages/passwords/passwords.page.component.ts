import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { groupByFn } from 'app/helpers/array.helpers';
import { Dictionary } from 'app/helpers/type.helpers';
import { PasswordListItem } from 'app/model/password-list-item.model';
import {
    IPasswordService,
    PASSWORD_SERVICE,
} from 'app/services/password.service';
import { EMPTY, map, Observable } from 'rxjs';

@Component({
    imports: [AsyncPipe, KeyValuePipe, MatDividerModule, MatListModule],
    templateUrl: './passwords.page.component.html',
    styleUrl: './passwords.page.component.scss',
})
export class PasswordsPageComponent implements OnInit {
    passwords: Observable<Dictionary<PasswordListItem>> = EMPTY;

    constructor(
        @Inject(PASSWORD_SERVICE) private passwordService: IPasswordService
    ) {}

    ngOnInit(): void {
        this.passwords = this.passwordService.getPasswords().pipe(
            map((arr) =>
                arr.map((item) => ({
                    ...item,
                    url: item.url.replace('https://', ''),
                }))
            ),
            map((arr) => groupByFn(arr, (item) => item.url[0].toUpperCase()))
        );
    }
}
