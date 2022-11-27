import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data, Params, Router } from '@angular/router';
import { Observable, map, concatMap, throwError, BehaviorSubject, withLatestFrom, zip, combineLatestAll, combineLatest, of } from 'rxjs';
import { languages } from 'src/app/environment';
import { LanguageService } from 'src/app/services/language.service';
import { Course, emptyCourseLanguage, _languages } from '../course';
import { CourseService } from '../course.service';

import { TuiSidebarComponent  } from '@taiga-ui/addon-mobile';
import { themes, ThemeService } from 'src/app/services/theme.service';

enum courseModes{
    info = 'info',
    landing = 'landing',
    content = 'content',
    settings = 'settings',
    view = 'view',
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

    isDarkTheme$ = this.themeService.isDarkTheme$;
    constructor(
        private courseService: CourseService,
        private langService: LanguageService,
        private route: ActivatedRoute,
        private router: Router,
        // private cdRef: ChangeDetectorRef,
        private themeService: ThemeService
    ) { 
        // this.mode$ = combineLatest(
        //     [, this.route.queryParams]
        // )
        this.mode$ = this.route.data.pipe( concatMap( (data) => {
            // this.updateBreadcrumbsUrls(params['language'], params['courseUrl'], params['moduleUrl'], queryParams['content']);
            if(data['mode'] == 'content') return of(courseModes.view);
            return this.route.queryParams.pipe(map(
                qParams => {
                    switch(qParams['edit']){
                        case 'landing': return courseModes.landing;
                        case 'content': return courseModes.content;
                        case 'settings': return courseModes.settings;
                        default: return courseModes.info;
                    }
                }
            ))
        }))


        this.route.params.pipe(concatMap(params => {
            const url = params['courseUrl'];
            if(!url) {
                this.router.navigate(['']);
                return throwError(() => 'No url!');
            };
            return this.courseService.getCourse(url).pipe(withLatestFrom(this.language));
        })).subscribe( ([course, lang]) => {
            // this.updateBreadcrumbsNames(course, lang);
            // return;
            if(!course.languages) this.courseSubject$.next({...course, languages: <_languages>{en: emptyCourseLanguage()}});
            else this.courseSubject$.next(course);
        })

        this.courseTitle$ = this.course$.pipe(withLatestFrom(this.language), map(
            value => {
                const course = value[0], lang = value[1];
                if(!course) return 'undefined';
                return course.languages && course.languages[lang].title ? course.languages[lang].title : course.title;
            }
        ))

        this.course$.pipe(withLatestFrom())
    }

    title$url = this.course$.pipe(withLatestFrom(this.language), map(value => {
        if(!value[0]) return null;
        const lang = value[1];
        if(!value[0].languages || !value[0].languages[lang]) return {title: value[0].title, url: value[0].url, lang: languages.en};
        return {title: value[0].languages[lang].title, url: value[0].url, lang: lang};
    }))

    ngOnInit() {}
    
    ngOnDestroy(): void {}

    toggle(open: boolean): void {
        this.open.next(open);
        // this.cdRef.markForCheck();
    }

    // updateBreadcrumbsUrls(lang: languages, courseUrl?: string, moduleUrl?: string, contentIndex?: number){
    //     console.log(lang, courseUrl, moduleUrl, contentIndex)
    //     const courseBC = this.routeItems$.value;
    //     if(!courseUrl) return this.routeItems$.next([ courseBC[0] ]);
    //     courseBC[1] = {link: ['/course', lang, courseUrl], name: ''};
    //     if(!moduleUrl) return this.routeItems$.next([ courseBC[0], courseBC[1] ]);
    //     courseBC[2] = {link: [...courseBC[0].link, 'content', moduleUrl], name: ''};
    //     if(!contentIndex) return this.routeItems$.next([ courseBC[0], courseBC[1], courseBC[2] ]);
    //     courseBC[3] = {link: [...courseBC[0].link], name: '', query: {content: contentIndex}};
    //     this.routeItems$.next(courseBC);
    // }
    // updateBreadcrumbsNames(course: Course, lang: languages = languages.en){
    //     const courseBC = this.routeItems$.value;
    //     if(!courseBC[1]) return this.routeItems$.next([ courseBC[0]]);
    //     courseBC[1].name = course.languages ? ( course.languages[lang] ? course.languages[lang].title : course.languages.en.title) : course.title;
    //     if(!courseBC[2]) return this.routeItems$.next([ courseBC[0], courseBC[1] ]); 
    //     const module = course.modules?.find(m => m.url ==  courseBC[2].link.at(-1))
    //     if(!module) return this.routeItems$.next([ courseBC[0], courseBC[1] ]);
    //     courseBC[2].name = module.title;
    //     if(!courseBC[3]) return this.routeItems$.next([ courseBC[0], courseBC[1], courseBC[2] ]);
    //     const contentIdx = courseBC[3].query?.content || 0;
    //     const block = course.content?.find(b => b.moduleId == module?.moduleId && b.order == contentIdx);
    //     if(!block) return this.routeItems$.next([ courseBC[0], courseBC[1], courseBC[2] ]);
    //     courseBC[3].name = block.content.languages ? ( block.content.languages[lang].title || block.content.languages.en.title  ) : block.title
    //     this.routeItems$.next([ ...courseBC])
    // }
}