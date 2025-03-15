import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PageAction } from 'app/helpers/page.helpers';

@Component({
    selector: 'app-top-bar',
    imports: [MatToolbarModule, MatButtonModule, MatIconModule],
    templateUrl: './top-bar.component.html',
    styleUrl: './top-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
    @Input() title: string = '';
    @Input() pageActions: PageAction[] = [];
}
