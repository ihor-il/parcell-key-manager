import { Component } from '@angular/core';
import { Page, PageAction } from 'app/helpers/page.helpers';

@Component({
    imports: [],
    templateUrl: './settings.page.component.html',
    styleUrl: './settings.page.component.scss',
})
export class SettingsComponent extends Page {
    readonly title = 'Settings';
    readonly actions: PageAction[] = [];
}
