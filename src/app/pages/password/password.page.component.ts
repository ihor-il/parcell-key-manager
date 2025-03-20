import {
    Component,
    DestroyRef,
    inject,
    Inject,
    Input,
    signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import {
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import {
    IPasswordService,
    PASSWORD_SERVICE,
} from 'app/services/abstract/password.service';
import { filter, from } from 'rxjs';
import validator from 'validator';

@Component({
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './password.page.component.html',
    styleUrl: './password.page.component.scss',
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' },
        },
    ],
})
export class PasswordPageComponent {
    private readonly _fb = inject(FormBuilder);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _router = inject(Router);
    private readonly _route = inject(ActivatedRoute);

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
            validators: [Validators.required, Validators.pattern('\S*')],
            nonNullable: true,
        }),
        password: new FormControl('', {
            validators: [Validators.required, Validators.pattern('\S*')],
            nonNullable: true,
        }),
    });

    @Input() set id(passwordId: string) {
        this._id = passwordId;
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
        @Inject(PASSWORD_SERVICE) private passwordService: IPasswordService,
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
        ).subscribe();
    }

    deletePassword() {}
}
