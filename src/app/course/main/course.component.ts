import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { Observable, map, concatMap, throwError, BehaviorSubject, withLatestFrom, zip, combineLatestAll, combineLatest, of } from 'rxjs';
import { languages } from 'src/app/environment';
import { LanguageService } from 'src/app/services/language.service';
import { Course, emptyCourseLanguage, _languages } from '../course';
import { CourseService } from '../course.service';

import { TuiSidebarComponent  } from '@taiga-ui/addon-mobile';
import { themes, ThemeService } from 'src/app/services/theme.service';
import { AuthService } from 'src/app/services/auth.service';

enum courseModes{
    info = 'info',
    landing = 'landing',
    content = 'content',
    settings = 'settings',
}

interface BCParams{
    mode: courseModes,
    lang: languages,
    courseUrl: string,
    moduleUrl?: string,
    contentIndex?: number
}


@Component({
    selector: 'course',
    templateUrl: 'course.component.html',
    styleUrls: ['../course.component.less', 'sidebar.styles.less', '../landing/landing.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseComponent implements OnInit, OnDestroy {
    en = languages.en;
    
    open = new BehaviorSubject<boolean>(false);
    
    courseSubject$ = new BehaviorSubject<Course | undefined>(undefined);
    course$ = this.courseSubject$.asObservable();

    language = this.langService.currentLanguage;

    courseTitle$: Observable<string>;

    mode$: Observable<courseModes>;

    routeItems$ = new BehaviorSubject<{name: string, link: string[], query?: {content: number}}[]>([{name: 'Сourses', link: ['/courses']}]);
    route$ = this.routeItems$.asObservable();

    editor$: Observable<boolean>;

    constructor(
        private courseService: CourseService,
        private langService: LanguageService,
        private route: ActivatedRoute,
        private router: Router,
        // private cdRef: ChangeDetectorRef,
        private themeService: ThemeService,
        private auth: AuthService

    ) { 
        this.editor$ = this.auth.currentUserEditor;
        this.mode$ = this.route.queryParams.pipe(
            withLatestFrom(this.editor$),
            map(([qParams, editor]) => {
                if(!editor) return courseModes.info;
                switch(qParams['edit']){
                    case 'landing': return courseModes.landing;
                    case 'content': return courseModes.content;
                    case 'settings': return courseModes.settings;
                    default: return courseModes.info;
                }
            }
        ))

        this.route.params.pipe(concatMap(params => {
            const url = params['courseUrl'];
            if(!url) {
                this.router.navigate(['']);
                return throwError(() => 'No url!');
            };
            return this.courseService.getCourse(url, {update: true}).pipe(withLatestFrom(this.language));
        })).subscribe( ([course, lang]) => {
            if(!course.languages) this.courseSubject$.next({...course, languages: <_languages>{en: emptyCourseLanguage()}});
            else this.courseSubject$.next(course);
        })

        this.courseTitle$ = this.course$.pipe(withLatestFrom(this.language), map(
            ([course, lang]) => {
                if(!course) return 'undefined';
                return course.languages && course.languages[lang].title ? course.languages[lang].title : course.title;
            }
        ))

    }

    title$url = this.course$.pipe(withLatestFrom(this.language), map(([course, lang]) => {
        if(!course) return null;
        if(!course.languages || !course.languages[lang]) return {title: course.title, url: course.url, lang: languages.en};
        return {title: course.languages[lang].title, url: course.url, lang: lang};
    }))

    ngOnInit() {}
    
    ngOnDestroy(): void {}

    toggle(open: boolean): void {
        this.open.next(open);
    }

    onEditedCourse(course: Course){
        this.courseSubject$.next(course);
    }
}