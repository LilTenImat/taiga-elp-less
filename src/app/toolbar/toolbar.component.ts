import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, share } from 'rxjs';
import { languages } from '../environment';
import { AuthService } from '../services/auth.service';
import { LanguageService } from '../services/language.service';
import { themes, ThemeService } from '../services/theme.service';
import { User } from '../user/user';

@Component({
    selector: 'toolbar',
    templateUrl: 'toolbar.component.html',
    styleUrls: ['toolbar.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ToobarComponent implements OnInit {
    menuOpen = false;

    user$: Observable<User | null | undefined>;
    lang$: Observable<languages>;

    menuButtons = [
        {url: "about-us", icon: 'groups'},
        {url: "courses", icon: 'school'},
        {url: "classroom", icon: 'class'},
        {url: "library", icon: 'library_books'},
        {url: "blog", icon: 'forum'},
        {url: "contacts", icon: 'email'}
    ]

    @Output() themeChange = new EventEmitter<themes>();

    @Input() set theme(value: themes){this.nightTheme.patchValue(value == themes.dark);};

    nightTheme = new FormControl<boolean>(false);
    constructor(
        langService: LanguageService,
        auth: AuthService,
        private router: Router,
        private themeSevice: ThemeService
    ) { 
        themeSevice.currentTheme$.subscribe(theme => {
            this.nightTheme.patchValue(theme == themes.dark, {emitEvent: false});
        })
        this.user$ = auth.currentUser;
        this.lang$ = langService.currentLanguage;

        this.nightTheme.valueChanges.subscribe(value => this.themeSevice.setTheme(value ? themes.dark : themes.light));
    }

    ngOnInit() {}

    getAdmin = () => this.user$.pipe(map(u => !!u?.admin));
    getEditor = () => this.user$.pipe(map(u => !!u?.editor));

    urlContains(url: string){
        return this.router.routerState.snapshot.url.includes(url);
    }
}