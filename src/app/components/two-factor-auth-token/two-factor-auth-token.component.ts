import { AsyncPipe, NgClass, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, Inject, inject } from '@angular/core';
import {
    MAT_BOTTOM_SHEET_DATA,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { OtpTokenItem } from 'app/model/otp-auth.model';
import { OtpAuthService } from 'app/services/otp-auth.service';
import {
    distinct,
    exhaustMap,
    filter,
    from,
    interval,
    map,
    Observable,
    shareReplay,
    startWith,
} from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    imports: [NgIf, NgClass, AsyncPipe, MatProgressBarModule, NgTemplateOutlet],
    templateUrl: './two-factor-auth-token.component.html',
    styleUrl: './two-factor-auth-token.component.scss',
})
export class TwoFactorAuthTokenComponent {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _bottomSheetRef = inject(MatBottomSheetRef);
    private readonly _optAuthService = inject(OtpAuthService);

    public readonly model$: Observable<OtpTokenItem>;
    public readonly token$: Observable<string>;
    public readonly progressBarValue$: Observable<number>;

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) data: { id: string }) {
        this.model$ = from(this._optAuthService.getAuthToken(data.id)).pipe(
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
