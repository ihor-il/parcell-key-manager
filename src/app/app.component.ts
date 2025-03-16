import { JsonPipe } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SafeArea } from 'capacitor-plugin-safe-area';
import { from } from 'rxjs';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, JsonPipe],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    @HostBinding("style.--safe-area-inset-top") inset_top!: string;
    @HostBinding("style.--safe-area-inset-bottom") inset_bottom!: string;
    @HostBinding("style.--safe-area-inset-left") inset_left!: string;
    @HostBinding("style.--safe-area-inset-right") inset_right!: string;

    insets: any;

    ngOnInit(): void {
        from(SafeArea.addListener('safeAreaChanged', (data) => {
            let insets: any;
            this.insets = { insets } = data;
            this.inset_top = `${insets.top}px`;
            this.inset_bottom = `${insets.bottom}px`;
            this.inset_left = `${insets.left}px`;
            this.inset_right = `${insets.right}px`;
        })).subscribe();
    }
}
