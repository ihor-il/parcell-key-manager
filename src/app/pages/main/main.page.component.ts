import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Page, PageAction } from 'app/helpers/page.helpers';
import { Unsubscribable } from 'rxjs';
import { BottomBarComponent } from '../../components/bottom-bar/bottom-bar.component';
import { TopBarComponent } from '../../components/top-bar/top-bar.component';

@Component({
    imports: [TopBarComponent, BottomBarComponent, RouterOutlet],
    templateUrl: './main.page.component.html',
    styleUrl: './main.page.component.scss',
})
export class MainPageComponent {
    private _updateActionsSubscription: Unsubscribable | undefined;
    private _pageActions: PageAction[] = [];
    private _title: string = '';

    public get pageActions(): PageAction[] {
        return this._pageActions;
    }

    public get title(): string {
        return this._title;
    }

    public onRouterOutletActivate(event: any) {
        this._updatePage(event);
    }

    onRouterOutletDeactivate() {
        this._updateActionsSubscription?.unsubscribe();
    }

    private _updatePage(obj: any) {
        if (!(obj instanceof Page)) {
            this._pageActions = [];
            this._title = '';
            return;
        }

        const page = obj as Page;

        this._pageActions = page.actions;
        this._title = page.title;
        this._updateActionsSubscription = page.actionsUpdated$.subscribe(
            (actions) => (this._pageActions = actions),
        );
    }
}
