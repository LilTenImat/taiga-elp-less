import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, concatMap, lastValueFrom, map, Observable, Subject } from 'rxjs';
import { languages, TUI_EDITOR_TOOLS } from 'src/app/environment';
import { emptyContent, IObject, ObjectTypeEnum, _blockLanguages } from '../content/content';
import { ContentService } from '../content/content.service';
import { Course } from '../course';
import { CourseService } from '../course.service';
import { Module } from './module';
import { ModuleService } from './module.service';
import { ModulesComponent } from './modules.component';

@Component({
    selector: 'edit-content',
    templateUrl: 'edit-modules.component.html',
    styleUrls: ['modules.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditContentComponent implements OnInit {
    @ViewChild('modulesComponent') modulesComponent!: ModulesComponent; 

    tools = TUI_EDITOR_TOOLS;
    en = languages.en;

    contentTypes = [ObjectTypeEnum.ARTICLE, ObjectTypeEnum.VIDEO, ObjectTypeEnum.READING_MATERIALS, ObjectTypeEnum.QUIZ]

    selectOpen = false;

    loadingBlock = new BehaviorSubject(false);
    loadingBlock$ = this.loadingBlock.asObservable();

    @Input() course$?: Observable<Course | undefined>;
    language$ = new BehaviorSubject<languages>(languages.en);
    lang$ = this.language$.asObservable();

    @Input() set lang(val: languages | null){this.language$.next(val ? val : languages.en)};

    constructor(
        private moduleService: ModuleService, 
        private contentService: ContentService,
        private courseService: CourseService
        ) { }
    ngOnInit() { }

    getModules = () => this.course$?.pipe(map(course => course?.modules || []));
    getContent = () => this.course$?.pipe(map(course => course?.content || []));
    getMode = () => this.course$?.pipe(map(course => course?.mode));

    async onAddModule(){
        if(!this.course$) return;
        const course = await lastValueFrom(this.course$);
        if(!course) return;
        this.loadingBlock.next(true);
        
        this.moduleService.postModule({
            title: 'New module',
            courseId: course.courseId,
            order: course.content?.length || 1,
            languages: {en: {title: 'New module'}}
        } as Module).subscribe(res => {
            this.courseService.refreshCourse(res.courseId);
            if(this.modulesComponent) this.modulesComponent.editModule(res.moduleId);
        }, err=>{}, () => { this.loadingBlock.next(false); });
    }

    async onAddBlock(type: ObjectTypeEnum = ObjectTypeEnum.ARTICLE){
        if(!this.course$) return;
        const course = await lastValueFrom(this.course$);
        if(!course) return;

        this.loadingBlock.next(true);

        let mId = course.modules?.reduce((p, v) => ( p.order < v.order ? p : v )).moduleId; 
        if(!mId) mId = course.modules ? course.modules[0].moduleId : '';

        this.contentService.postObject({
            completed: false,
            actions: [],
            objectId: '',
            courseId: course.courseId,
            moduleId: mId,
            title: `New ${type}`,
            type: type,
            content:  { languages: <_blockLanguages>{en: emptyContent(type)}, final_test: false},
            order: course.content ? course.content.filter(x => x.moduleId == mId).length : 0,
        } as IObject
        ).subscribe(res => {
            this.courseService.refreshCourse(res.courseId);

            if(this.modulesComponent) this.modulesComponent.editBlock(res.moduleId, res.objectId);
        }, err => {}, () => {this.loadingBlock.next(false);})
    }
}