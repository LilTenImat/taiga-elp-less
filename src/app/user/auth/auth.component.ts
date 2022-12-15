import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { themes, ThemeService } from 'src/app/services/theme.service';

@Component({
    selector: 'auth',
    template: `
        <ng-container [ngSwitch]="(mode$ | async)">
            <login *ngSwitchDefault [embed]="false"></login>
        </ng-container>
    `
})

export class AuthComponent implements OnInit {
    mode$: Observable<'login' | 'signup'>;

    constructor(
        private route: ActivatedRoute,
    ) {
        this.mode$ = this.route.data.pipe(map(value => value['mode'] || 'login'));
    }

    ngOnInit() { }
}