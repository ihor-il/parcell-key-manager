import { AsyncPipe, KeyValuePipe, NgIf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import {
    CapacitorBarcodeScanner,
    CapacitorBarcodeScannerCameraDirection,
    CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';
import { Toast } from '@capacitor/toast';
import { TwoFactorAuthTokenComponent } from 'app/components/two-factor-auth-token/two-factor-auth-token.component';
import { groupByFn } from 'app/helpers/array.helpers';
import { Page, PageAction } from 'app/helpers/page.helpers';
import { Dictionary } from 'app/helpers/type.helpers';
import { OtpTokenListItem, OtpTokenModel } from 'app/model/otp-auth.model';
import { OtpAuthService } from 'app/services/otp-auth.service';
import {
    EMPTY,
    filter,
    from,
    map,
    mergeMap,
    Observable,
    shareReplay,
    startWith,
    Subject,
    switchMap,
    tap,
} from 'rxjs';

@Component({
    imports: [NgIf, AsyncPipe, MatListModule],
    providers: [OtpAuthService],
    templateUrl: './two-factor-auth.page.component.html',
    styleUrl: './two-factor-auth.page.component.scss',
})
export class TwoFactorAuthComponent extends Page implements OnInit {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _route = inject(ActivatedRoute);
    private readonly _otpAuthService = inject(OtpAuthService);

    private _bottomSheet = inject(MatBottomSheet);
    private readonly _reload = new Subject<void>();

    tokens$: Observable<OtpTokenListItem[]> = EMPTY;

    readonly title = 'Authenticators';
    actions: PageAction[] = [
        {
            icon: 'add',
            callback: () => this.add2faCode(),
        },
    ];

    ngOnInit(): void {
        this._route.queryParams
            .pipe(
                map((qp) => qp['add'] as string),
                filter((param) => !!param),
                takeUntilDestroyed(this._destroyRef),
            )
            .subscribe((link) => this._handleOtpAuthLink(link));

        this.tokens$ = this._reload
            .pipe(
                startWith(void 0),
                switchMap(() => this._otpAuthService.getAuthTokens()),
            )
            .pipe(shareReplay());
    }

    add2faCode() {
        from(
            CapacitorBarcodeScanner.scanBarcode({
                cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
                hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
            }),
        )
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                map((x) => x.ScanResult),
            )
            .subscribe((link) => this._handleOtpAuthLink(link));
    }

    showToken(id: string): void {
        this._bottomSheet
            .open(TwoFactorAuthTokenComponent, {
                closeOnNavigation: true,
                autoFocus: 'dialog',
                data: { id },
            })
            .afterDismissed()
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                filter((result) => !!result),
            )
            .subscribe(() => this._reload.next());
    }

    private _handleOtpAuthLink(link: string) {
        let model: OtpTokenModel;
        try {
            model = this._otpAuthService.parseOtpAuthUrl(link);
        } catch {
            Toast.show({ text: 'Error while scanning code' });
            return;
        }

        from(this._otpAuthService.getTokenExists(model))
            .pipe(
                mergeMap((exists) =>
                    exists
                        ? from(
                              Toast.show({
                                  text: 'Scanned token already exists',
                              }),
                          ).pipe(mergeMap(() => EMPTY))
                        : this._otpAuthService.createAuthToken(model),
                ),
                tap(() => this._reload.next()),
            )
            .subscribe((model) => this.showToken(model.id));
    }

    private _groupPasswords(
        items: OtpTokenListItem[],
    ): Dictionary<OtpTokenListItem> {
        return groupByFn(items, (item) => item.issuer[0].toUpperCase());
    }
}
