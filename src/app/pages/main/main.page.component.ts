import { TopBarComponent } from '../../components/top-bar/top-bar.component';
import { Component } from '@angular/core';
import { BottomBarComponent } from '../../components/bottom-bar/bottom-bar.component';
import { RouterOutlet } from '@angular/router';
import { checkDiscriminator } from 'app/helpers/interface.helpers';
import { instanceOfPageWithActions, PageAction, PageWithActions } from 'app/helpers/page.helpers';

@Component({
    imports: [TopBarComponent, BottomBarComponent, RouterOutlet],
    templateUrl: './main.page.component.html',
    styleUrl: './main.page.component.scss',
})
export class MainPageComponent {
    private _pageActions: PageAction[] = [];

    public get pageActions(): PageAction[] {
        return this._pageActions;
    }

    public onRouterOutletActivate(event: any) {
        this._updatePageActions(event);
    }

    _updatePageActions(obj: any) {
        if (!instanceOfPageWithActions(obj)) {
            this._pageActions = [];
            return;
        }

        this._pageActions = (obj as PageWithActions).getActions()
    }
}
