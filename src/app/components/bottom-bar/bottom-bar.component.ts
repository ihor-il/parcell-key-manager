import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        RouterLink,
        RouterLinkActive,
    ],
    selector: 'app-bottom-bar',
    templateUrl: './bottom-bar.component.html',
    styleUrl: './bottom-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomBarComponent {}
