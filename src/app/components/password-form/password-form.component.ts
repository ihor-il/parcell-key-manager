import {
    Component,
    DestroyRef,
    inject,
    Inject,
    Input,
    signal,
    TemplateRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {
    MAT_BOTTOM_SHEET_DATA,
    MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PasswordService } from 'app/services/password.service';
import { filter, from, mergeMap } from 'rxjs';
import validator from 'validator';

@Component({
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
    ],
    templateUrl: './password-form.component.html',
    styleUrl: './password-form.component.scss',
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' },
        },
        PasswordService,
    ],
})
export class PasswordPageComponent {
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _bottomSheetRef = inject(MatBottomSheetRef);
    private readonly _matDialog = inject(MatDialog);

    private _id: string = '';

    public readonly form = new FormGroup({
        id: new FormControl('', { nonNullable: true }),
        url: new FormControl('', {
            validators: [
                Validators.required,
                (control) =>
                    validator.isURL(control.value) ? null : { isNotURL: true },
            ],
            nonNullable: true,
        }),
        username: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true,
        }),
        password: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true,
        }),
    });

    @Input() set id(passwordId: string) {
        this._id = passwordId;
        if (!passwordId) return;

        from(this.passwordService.getPassword(passwordId))
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                filter((model) => !!model),
            )
            .subscribe((model) => {
                this.form.setValue(model);
                this.form.controls.url.disable();
            });
    }

    get isEditMode(): boolean {
        return !!this._id;
    }

    constructor(
        private passwordService: PasswordService,
        @Inject(MAT_BOTTOM_SHEET_DATA) data?: { id: string },
    ) {
        this.id = data?.id ?? '';
    }

    hide = signal(true);
    clickEvent(event: MouseEvent) {
        this.hide.update((v) => !v);
        event.stopPropagation();
    }

    savePassword() {
        if (!this.form.valid) {
            return;
        }

        const model = this.form.getRawValue();
        from(
            this.isEditMode
                ? this.passwordService.updatePassword(model)
                : this.passwordService.createPassword(model),
        ).subscribe(() => this._bottomSheetRef.dismiss());
    }

    deletePassword(templateRef: TemplateRef<any>) {
        this._matDialog
            .open<any, any, boolean>(templateRef)
            .afterClosed()
            .pipe(
                takeUntilDestroyed(this._destroyRef),
                filter((result) => !!result),
                mergeMap(() => this.passwordService.deletePassword(this._id)),
            )
            .subscribe(() => this._bottomSheetRef.dismiss(true));
    }
}
