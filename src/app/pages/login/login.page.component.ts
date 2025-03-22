import { AsyncPipe, NgIf } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Toast } from '@capacitor/toast';
import { NativeBiometric } from 'capacitor-native-biometric';
import { from, map, Observable, startWith } from 'rxjs';

@Component({
    imports: [MatButtonModule, AsyncPipe],
    templateUrl: './login.page.component.html',
    styleUrl: './login.page.component.scss',
})
export class LoginPageComponent {
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);

    public readonly isBiometricAvaliable$: Observable<boolean | undefined> =
        from(NativeBiometric.isAvailable()).pipe(
            startWith(undefined),
            map((res) => res?.isAvailable),
        );

    verifyIdentity() {
        const verificationConfig = {
            title: 'Log in',
            description: 'Please authenticate to proceed',
            useFallback: true,
        };

        from(NativeBiometric.verifyIdentity(verificationConfig))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.router.navigate(['/', 'app']),
                error: () => Toast.show({ text: 'Unable to authorize' }),
            });
    }
}
