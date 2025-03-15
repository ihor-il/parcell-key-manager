import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { groupByFn } from 'app/helpers/array.helpers';
import { Page, PageAction } from 'app/helpers/page.helpers';
import { Dictionary } from 'app/helpers/type.helpers';
import { PasswordListItem } from 'app/model/password-list-item.model';
import {
    IPasswordService,
    PASSWORD_SERVICE,
} from 'app/services/password.service';
import { combineLatest, EMPTY, map, Observable, share, shareReplay, startWith, tap } from 'rxjs';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    imports: [
        AsyncPipe,
        KeyValuePipe,
        MatDividerModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './passwords.page.component.html',
    styleUrl: './passwords.page.component.scss',
})
export class PasswordsPageComponent extends Page implements OnInit {
    title = 'Passwords' as const;
    isSearchVisible: boolean = false;

    passwords: Observable<Dictionary<PasswordListItem>> = EMPTY;
    isAnyItemVisible: Observable<boolean> = EMPTY;
    searchControl = new FormControl<string>('');

    constructor(
        @Inject(PASSWORD_SERVICE) private passwordService: IPasswordService,
    ) {
        super();
    }

    get actions(): PageAction[] {
        return [
            { icon: 'add', callback: () => this._add() },
            {
                icon: this.isSearchVisible ? 'search_off' : 'search',
                callback: () => this._toggleSearch(),
            },
        ];
    }

    ngOnInit(): void {
        this.passwords = combineLatest([
            this.passwordService.getPasswords(),
            this.searchControl.valueChanges.pipe(startWith('')),
        ]).pipe(
            shareReplay(),
            map(([arr, search]) => [this._mapPasswords(arr), search] as const),
            map(([arr, search]) => this._searchPasswords(arr, search)),
            map(this._groupPasswords),
        );

        this.isAnyItemVisible = this.passwords.pipe(
            map((data) => Object.keys(data).length > 0),
        );
    }

    openPasswordDialog(password: PasswordListItem) {}

    private _toggleSearch() {
        this.isSearchVisible = !this.isSearchVisible;
        this._actionsUpdated.next(this.actions);
    }

    private _add() {}

    private _mapPasswords(items: PasswordListItem[]): PasswordListItem[] {
        return items.map((item) => ({
            ...item,
            url: item.url.replace('https://', ''),
        }));
    }

    private _searchPasswords(
        items: PasswordListItem[],
        search: string | null,
    ): PasswordListItem[] {
        if (!search) {
            return items;
        }

        const searchValue = search.toLowerCase();
        return items.filter(
            (item) =>
                item.url.toLowerCase().includes(searchValue) ||
                item.username.toLowerCase().includes(searchValue),
        );
    }

    private _groupPasswords(
        items: PasswordListItem[],
    ): Dictionary<PasswordListItem> {
        return groupByFn(items, (item) => item.url[0].toUpperCase());
    }
}
