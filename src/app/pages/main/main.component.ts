import { TopBarComponent } from './../../components/top-bar/top-bar.component';
import { Component } from '@angular/core';
import { BottomBarComponent } from '../../components/bottom-bar/bottom-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    imports: [TopBarComponent, BottomBarComponent, RouterOutlet],
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
})
export class MainComponent {}
