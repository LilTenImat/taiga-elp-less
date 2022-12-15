import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, concatMap, map, Observable, of, concat, withLatestFrom } from 'rxjs';
import { languages } from '../../environment';
import { XapiStatement } from '../../interfaces/xapiStatement';
import { LanguageService } from '../../services/language.service';
import { Course, _language } from '../course';

interface _info{
    image: string,
    mode: Course['mode']
    title: string,
    additional: string,
    intro: string,
    goals: string[],
    benefits: string[],
    requirenments: string[],
    description: string,
    languages: string[],
    price: number,
    actions: XapiStatement[],
    isJoined?: boolean,
    url: string,
}

@Component({
    selector: 'course-landing',
    templateUrl: 'landing.component.html',
    styleUrls: ['./landing.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LandingComponent implements OnInit {
    en = languages.en;
    @Input() course$?: Observable<Course | undefined>;

    language: Observable<languages>;

    constructor(
        private langService: LanguageService
    ) {
        this.language = langService.currentLanguage
    }

    ngOnInit() {}

    getModules = () => this.course$?.pipe(map(course => course?.modules || []));
    getContent = () => this.course$?.pipe(map(course => course?.content || []));
    
    getInfo = () => this.course$?.pipe(withLatestFrom(this.language), map(value => {
            const course = value[0], lang = value[1];
            if(!course) return undefined;
            const content: _language = course.languages ? course.languages[lang] : course.languages!.en;

            return {
                image: course.image ? `url('${course.image}')` : '',
                mode: course.mode,
                actions: course.actions,
                title: content.title || course.title,
                price: course.price,
                languages: course.courseLanguages ? course.courseLanguages : [languages.en],
                url: course.url,
                
                additional: content.additional,
                intro: content.intro,
                description: content.description,
                goals: content.goals ? content.goals : [],
                benefits: content.benefits ? content.benefits : [],
                requirenments: content.requirements ?  content.requirements : []
            } as _info;
        }
    ))
    
    joined$ = this.course$?.pipe(map(course => {
        if(!course) return false;
        return !!course?.actions.find(a => a.verb.type == 'join');
    }))
}