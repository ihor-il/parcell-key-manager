import { AsyncPipe, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import {
    Component,
    DestroyRef,
    Inject,
    inject,
    TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    MAT_BOTTOM_SHEET_DATA,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OtpTokenItem } from 'app/model/otp-auth.model';
import { OtpAuthService } from 'app/services/otp-auth.service';
import {
    distinct,
    exhaustMap,
    filter,
    from,
    interval,
    map,
    mergeMap,
    Observable,
    shareReplay,
    startWith,
} from 'rxjs';

@Component({
    imports: [
        NgIf,
        NgClass,
        AsyncPipe,
        MatProgressBarModule,
        NgTemplateOutlet,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
    ],
    templateUrl: './two-factor-auth-token.component.html',
    styleUrl: './two-factor-auth-token.component.scss',
})
export class TwoFactorAuthTokenComponent {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _bottomSheetRef = inject(MatBottomSheetRef);
    private readonly _optAuthService = inject(OtpAuthService);
    private _matDialog = inject(MatDialog);

    private readonly _id: string;

    public readonly model$: Observable<OtpTokenItem>;
    public readonly token$: Observable<string>;
    public readonly progressBarValue$: Observable<number>;

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) data: { id: string }) {
        this._id = data.id;

        this.model$ = from(this._optAuthService.getAuthToken(this._id)).pipe(
            shareReplay(),
            filter((model) => !!model),
            map((model) => model!),
        );

        const timer$ = this.model$.pipe(exhaustMap(this._getTimer));

        this.token$ = timer$.pipe(
            map(
                (model) =>
                    [model, this._optAuthService.getTime(model)] as const,
            ),
            distinct(([_, time]) => time),
            map(([model, _]) => this._optAuthService.generateOtpCode(model)),
        );

        this.progressBarValue$ = timer$.pipe(
            shareReplay(),
            map((model) => this._getProgressBarValue(model)),
        );
    }

    deleteToken(template: TemplateRef<any>) {
        this._matDialog
            .open<any, any, boolean>(template)
            .afterClosed()
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                filter((result) => !!result),
                mergeMap(() => this._optAuthService.deleteAuthToken(this._id)),
            )
            .subscribe(() => this._bottomSheetRef.dismiss(true));
    }

    private _getTimer(model: OtpTokenItem) {
        return interval(250).pipe(
            startWith(0),
            map(() => model),
        );
    }

    private _getProgressBarValue(model: OtpTokenItem) {
        const secondsTillUpdate = (Date.now() / 1000) % model.period;
        return ((model.period - secondsTillUpdate) / model.period) * 100;
    }
}
