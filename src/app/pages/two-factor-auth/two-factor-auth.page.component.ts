import { Component } from '@angular/core';
import { Page, PageAction } from 'app/helpers/page.helpers';

@Component({
  imports: [],
  templateUrl: './two-factor-auth.page.component.html',
  styleUrl: './two-factor-auth.page.component.scss'
})
export class TwoFactorAuthComponent extends Page {
    readonly title = 'Authenticators';
    actions: PageAction[] = [];
}
