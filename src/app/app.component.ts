import {
    Component,
    DestroyRef,
    HostBinding,
    inject,
    OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { SafeArea, SafeAreaInsets } from 'capacitor-plugin-safe-area';
import { from } from 'rxjs';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    @HostBinding('style.--safe-area-inset-top') inset_top!: string;
    @HostBinding('style.--safe-area-inset-bottom') inset_bottom!: string;
    @HostBinding('style.--safe-area-inset-left') inset_left!: string;
    @HostBinding('style.--safe-area-inset-right') inset_right!: string;

    ngOnInit(): void {
        from(
            SafeArea.addListener('safeAreaChanged', (insets) =>
                this._setInsets(insets),
            ),
        )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();

        SafeArea.getSafeAreaInsets().then((insets) => this._setInsets(insets));
    }

    private _setInsets(obj: SafeAreaInsets) {
        const insets = obj.insets;

        this.inset_top = `${insets.top}px`;
        this.inset_bottom = `${insets.bottom}px`;
        this.inset_left = `${insets.left}px`;
        this.inset_right = `${insets.right}px`;
    }
}
