import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, concatMap, lastValueFrom, map, Observable, of, skip, throwError, withLatestFrom } from 'rxjs';
import { languages, TUI_EDITOR_TOOLS } from 'src/app/environment';
import { LanguageService } from 'src/app/services/language.service';
import { Course, emptyCourseLanguage, _languages } from '../course';
import { CourseService } from '../course.service';
import { Location } from '@angular/common';

@Component({
    selector: 'edit-landing',
    templateUrl: 'edit-landing.component.html',
    styleUrls: ['./landing.component.less', '../course.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EditLandingComponent implements OnInit {
    tools = TUI_EDITOR_TOOLS;
    en = languages.en;

    savingCourse = new BehaviorSubject<boolean>(false);
    savingState$ = this.savingCourse.asObservable();

    @Input() course$?: Observable<Course | undefined>;
    language$ = new BehaviorSubject<languages>(languages.en);
    lang$ = this.language$.asObservable();

    @Output() edited = new EventEmitter<Course>();

    courseForm = new FormGroup({
        description: new FormControl(''),
        additional: new FormControl(''),
        title: new FormControl(''),
        intro: new FormControl(''),
        cardInfo: new FormControl(''),
        duration: new FormControl(''),
        image: new FormControl(''),
    })

    constructor(
        private courseService: CourseService,
        private languageService: LanguageService,
        private location: Location,
    ) { 
        languageService.currentLanguage.subscribe(lang => this.language$.next(lang));

    }

    ngOnInit() {
        this.course$?.pipe(withLatestFrom(this.lang$)).subscribe(value => {
            if(!value[0]) return this.courseForm.reset(undefined, {emitEvent: false});
            const content = value[0].languages ? value[0].languages[value[1]] : value[0].languages!.en;
            this.courseForm.setValue({
                description: content.description || '',
                additional: content.additional || '',
                title: content.title || '',
                intro: content.intro || '',
                cardInfo: content.cardInfo || '',
                duration: value[0].duration || '',
                image: value[0].image || '',
            }, {emitEvent: false});
        })
    }

    getModules = () => this.course$?.pipe(map(course => course?.modules || []));
    getContent = () => this.course$?.pipe(map(course => course?.content || []));

    onValuesFromCard(ev: {image: string, cardInfo: string, duration: number}){
        this.courseForm.patchValue({
            image: ev.image,
            cardInfo: ev.cardInfo,
            duration: ev.duration?.toString()
        })
    }

    onSaveChanges(){
        if(!this.course$) return;

        this.savingCourse.next(true);

        const controls = this.courseForm.controls;
        this.course$.pipe(concatMap(course => course ? this.courseService.putCourse({
            courseId: course.courseId,
            languages: {
                [this.language$.value]: {
                    description: controls.description.value || '',
                    additional: controls.additional.value || '',
                    title: controls.title.value || '',
                    intro: controls.intro.value || '',
                    cardInfo: controls.cardInfo.value || '',
                }
            },
            duration: controls.duration.value || '',
            image: controls.image.value || ''
        } as Course) : throwError(() => 'No course!') )).subscribe(res => {
            this.edited.emit(res);
        }, err => {}, () => {
            this.courseForm.reset();
            this.savingCourse.next(false);
        })
    }

    goBack(){
        this.location.back();
    }
}