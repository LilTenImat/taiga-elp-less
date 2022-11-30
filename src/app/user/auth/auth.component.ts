import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { themes, ThemeService } from 'src/app/services/theme.service';

@Component({
    selector: 'auth',
    template: `
    <ng-container *tuiLet="!!(isDarkTheme$ | async) as darkTheme">
        <tui-theme-night *ngIf="darkTheme"></tui-theme-night>
        <tui-root > 
            <ng-container [ngSwitch]="(mode$ | async)">
                <login *ngSwitchDefault [embed]="false"></login>
            </ng-container>
        </tui-root>
    </ng-container>`
})

export class AuthComponent implements OnInit {
    isDarkTheme$ = this.themeService.isDarkTheme$;

    mode$: Observable<'login' | 'signup'>;

    constructor(
        private themeService: ThemeService,
        private route: ActivatedRoute,
        
    ) {
        this.mode$ = this.route.data.pipe(map(value => value['mode'] || 'login'));
    }

    ngOnInit() { }
}