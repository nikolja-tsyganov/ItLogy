import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutService } from './services/main-layout.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {

    constructor(private mainLayoutService: MainLayoutService) {}

    protected readonly title = signal('ItLogy');
}
