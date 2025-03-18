import { KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { bottomBarConfig } from './bottom-bar.config';

@Component({
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        RouterLink,
        RouterLinkActive,
        KeyValuePipe,
    ],
    selector: 'app-bottom-bar',
    templateUrl: './bottom-bar.component.html',
    styleUrl: './bottom-bar.component.scss',
})
export class BottomBarComponent {
    readonly config = bottomBarConfig;
}
