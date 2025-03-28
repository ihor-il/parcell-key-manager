import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { groupByFn } from 'app/helpers/array.helpers';
import { Page, PageAction } from 'app/helpers/page.helpers';
import { Dictionary } from 'app/helpers/type.helpers';
import { PasswordListItem } from 'app/model/password.model';
import {
    combineLatest,
    EMPTY,
    map,
    Observable,
    shareReplay,
    startWith,
    Subject,
    switchMap,
} from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
    MatBottomSheet,
    MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { PasswordService } from 'app/services/password.service';
import { PasswordPageComponent } from '../../components/password-form/password-form.component';

@Component({
    imports: [
        AsyncPipe,
        KeyValuePipe,
        MatDividerModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        RouterModule,
        MatBottomSheetModule,
    ],
    providers: [PasswordService],
    templateUrl: './password-list.page.component.html',
    styleUrl: './password-list.page.component.scss',
})
export class PasswordListPageComponent extends Page implements OnInit {
    private passwordService = inject(PasswordService);
    private _bottomSheet = inject(MatBottomSheet);
    private _destroyRef = inject(DestroyRef);
    private readonly _reload = new Subject<void>();

    title = 'Passwords' as const;
    isSearchVisible: boolean = false;

    passwords: Observable<Dictionary<PasswordListItem>> = EMPTY;
    isAnyItemVisible: Observable<boolean> = EMPTY;
    searchControl = new FormControl<string>('');

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
            this._reload.pipe(
                startWith(void 0),
                switchMap(() => this.passwordService.getPasswords()),
            ),
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

    openPasswordPage(password: PasswordListItem) {
        this._bottomSheet
            .open(PasswordPageComponent, {
                closeOnNavigation: true,
                data: { id: password.id },
                autoFocus: 'dialog',
            })
            .afterDismissed()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => this._reload.next());
    }

    private _toggleSearch() {
        this.isSearchVisible = !this.isSearchVisible;
        this._actionsUpdated.next(this.actions);
    }

    private _add() {
        this._bottomSheet
            .open(PasswordPageComponent, {
                closeOnNavigation: true,
                autoFocus: 'dialog',
            })
            .afterDismissed()
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => this._reload.next());
    }

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
