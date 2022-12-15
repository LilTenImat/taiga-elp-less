import { ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TuiScrollbarComponent } from '@taiga-ui/core';
import { BehaviorSubject, concatMap, map, Observable, of, Subject, Subscription, tap, withLatestFrom, zip } from 'rxjs';
import { languages } from 'src/app/environment';
import { LanguageService } from 'src/app/services/language.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Course } from '../course';
import { CourseService } from '../course.service';
import { Module } from '../module/module';
import { Article, Content, ObjectTypeEnum, Ppt, Quiz, ReadingMaterials, Video } from './content';


type typedContent = Content & {type: ObjectTypeEnum};

interface courseInfo{ 
    url: string, 
    mode: 'sequential' | 'free', 
    title: string,
};

interface _Content{
    module: Module,
    blocks: typedContent[],
    info: courseInfo,
}   

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['content.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit {
    course$?: Observable<Course | undefined>;
    contentIndex$ = new BehaviorSubject<number>(0);
    contentIndex = this.contentIndex$.asObservable();

    openedIndex$ = new BehaviorSubject<number>(0);
    openedIndex = this.openedIndex$.asObservable();
    openModules = false;
    lang: languages = languages.en;

    isDarkTheme$ = this.themeService.isDarkTheme$;

    contentSubject$ = new BehaviorSubject<_Content | null>(null);
    content$ = this.contentSubject$.asObservable();
    // content$: Observable<_Content | null>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private courseService: CourseService,
        private themeService: ThemeService,
        private languageServie: LanguageService
    ) {
        languageServie.currentLanguage.subscribe(l => this.lang = l);
        route.queryParams.pipe(map(qParams => this.contentIndex$.next((qParams['content'] as number) || 0)));
        route.params.subscribe(params => {
            this.course$ = courseService.getCourse(params['courseUrl']);
        });

    }

    ngOnInit(){
        let paramsSubcriber: Subscription;

        this.course$?.subscribe(course => {
            paramsSubcriber?.unsubscribe();

            paramsSubcriber = this.route.params.subscribe(params => {
                if(!course) return this.contentSubject$.next(null);
                const module = course.modules?.find(m => m.url == params['moduleUrl']);
                if(!module) return this.contentSubject$.next(null);
                this.openedIndex$.next(module.order);
                this.contentSubject$.next({
                    module: module,
                    blocks: course.content?.filter(b => b.moduleId == module.moduleId)
                            .sort((a, b) => a.order - b.order)
                            .map(content => ( {type: content.type, ...content.content.languages[this.lang]} ) ) || [],
                    info: { url: params['courseUrl'] || '', mode: course.mode, title: course.languages ? course.languages[this.lang].title : course.title }
                });
            })
        })
    }

    getModules = () => this.course$?.pipe(map(course => course?.modules || []));
    getContent = () => this.course$?.pipe(map(course => course?.content || []));

    notEmptyBlock(content: Content, type: ObjectTypeEnum = ObjectTypeEnum.ARTICLE){
        if(!content) return false;
        switch(type){
            case ObjectTypeEnum.VIDEO: { const temp = content as Video; return !!(temp.link || temp.files?.length) };
            case ObjectTypeEnum.QUIZ: { const temp = content as Quiz; return !!temp.questions?.length };
            case ObjectTypeEnum.READING_MATERIALS: { const temp = content as ReadingMaterials; return !!(temp.text || temp.texts?.length || temp.titles?.length || temp.files?.length) };
            case ObjectTypeEnum.PPT: { const temp = content as Ppt; return !!(temp.link || temp.text) };
            case ObjectTypeEnum.ARTICLE: 
            default: { const temp = content as Article; return !!(temp.link || temp.text) };
        }
    }

    log = console.log

    scroll(direction: 'left' | 'right') {
        const idx = this.contentIndex$.value + (direction == 'left' ? -1 : 1);
        this.contentIndex$.next(idx);
        (document.querySelector(`#tab-${idx}`) as HTMLElement )?.scrollIntoView({behavior: "smooth", block: 'nearest'});
    }

    toggleSidebar(open: boolean){
        this.openModules = open;
    }
}