import { DOCUMENT } from '@angular/common';
import {
    Component,
    DestroyRef,
    inject,
    OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { PluginListenerHandle } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { SafeArea, SafeAreaInsets } from 'capacitor-plugin-safe-area';
import { from } from 'rxjs';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    private _destroyRef = inject(DestroyRef);
    private _document = inject(DOCUMENT);

    private _insets: SafeAreaInsets = {
        insets: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    ngOnInit(): void {
        this._registerSafeAreaListeners();
        this._registerKeyboardListeners();
        this._getInsets();
    }

    private _registerSafeAreaListeners() {
        this._registerCapacitorEventListener(
            SafeArea.addListener('safeAreaChanged', (insets) =>
                this._setInsets(insets),
            ),
        );
    }

    private _registerKeyboardListeners() {
        this._registerCapacitorEventListener(
            Keyboard.addListener('keyboardWillShow', (info) => {
                const safeArea = this._insets.insets;
                this._setInsets({
                    insets: {
                        ...safeArea,
                        bottom: info.keyboardHeight + safeArea.bottom,
                    },
                });
            }),
        );

        this._registerCapacitorEventListener(
            Keyboard.addListener('keyboardWillHide', () => {
                this._getInsets();
            }),
        );
    }

    private _getInsets() {
        SafeArea.getSafeAreaInsets().then((insets) => {
            this._insets = insets;
            this._setInsets(insets);
        });
    }

    private _registerCapacitorEventListener(
        listenerPromise: Promise<PluginListenerHandle>,
    ) {
        from(listenerPromise)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe();
    }

    private _setInsets(obj: SafeAreaInsets) {
        this._document.documentElement.style.setProperty(
            '--safe-area-inset-top',
            `${obj.insets.top}px`,
        );
        this._document.documentElement.style.setProperty(
            '--safe-area-inset-bottom',
            `${obj.insets.bottom}px`,
        );
        this._document.documentElement.style.setProperty(
            '--safe-area-inset-left',
            `${obj.insets.left}px`,
        );
        this._document.documentElement.style.setProperty(
            '--safe-area-inset-right',
            `${obj.insets.right}px`,
        );
    }
}
