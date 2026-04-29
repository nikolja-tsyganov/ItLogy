import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { debounceTime, distinctUntilChanged, fromEvent, map, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MainLayoutService {
    private renderer!: Renderer2;
    private destroy$ = new Subject<void>();

    private readonly BASE_WINDOW_WIDTH = 1600;

    constructor(
        private rendererFactory: RendererFactory2,
    ) {
        this.renderer = this.rendererFactory.createRenderer(null, null);
        this.setupResizeListener();
    }

    private setupResizeListener(): void {
        const resize$ = fromEvent(window, 'resize').pipe(
            map(() => window.innerWidth),
            debounceTime(100),
            distinctUntilChanged()
        );

        resize$.subscribe((windowWidth) => {
            this.calculateMainFontSize(windowWidth);
        });
    }

    private calculateMainFontSize(width: number): void {
        const delta = width > this.BASE_WINDOW_WIDTH ? 1 : width / this.BASE_WINDOW_WIDTH
        this.renderer.setStyle(document.documentElement, 'font-size', `${delta * 10}px`);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
