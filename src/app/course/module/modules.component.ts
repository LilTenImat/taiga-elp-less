import { ChangeDetectionStrategy, Component, Input, OnInit, AfterViewInit, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, tap } from 'rxjs';
import { languages } from 'src/app/environment';
import { IObject, Content, ObjectTypeEnum, Video, Quiz, ReadingMaterials, Ppt, Article } from '../content/content';
import { Module, _moduleLanguages } from './module';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EditBlockComponent } from '../content/edit-block.component';
import { FormControl } from '@angular/forms';
import { ContentService } from '../content/content.service';
import { CourseService } from '../course.service';
import { ModuleService } from './module.service';

@Component({
    selector: 'course-modules',
    templateUrl: 'modules.component.html',
    styleUrls: ['./modules.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ModulesComponent implements OnInit {
    @ViewChild('editBlock') editBlockComponent!: EditBlockComponent;
    @Input() mode: 'free' | 'sequential' = 'free';
    @Input() disabled = false;
    @Input() courseUrl?: string;
    @Input() modules?: Observable<Module[]>;
    @Input() content?: Observable<IObject[]>;
    @Input() public editModule(moduleId: string){
        this.moduleTitleForm.setValue('New module');
        this.editingModuleId.next(moduleId);
        this.editingBlockId.next('');
    }
    @Input() public editBlock(moduleId: string, objectId: string){
        this.moduleTitleForm.setValue('');
        this.editingModuleId.next(moduleId);
        this.editingBlockId.next(objectId);
    }
    @Input() lang: languages = languages.en;
    @Input() editing: boolean = false;

    @Output() loading = new EventEmitter<boolean>();
    
    modulesSubject$ = new BehaviorSubject<Module[]>([]);
    contentSubject$ = new BehaviorSubject<IObject[]>([]);

    openedModules = new BehaviorSubject<string[]>([]);
    openedIds = this.openedModules.asObservable();

    editingModuleId = new BehaviorSubject<string>('');
    editingModuleId$ = this.editingModuleId.asObservable();

    editingBlockId = new BehaviorSubject<string>('');
    editingBlockId$ = this.editingBlockId.asObservable();

    moduleTitleForm = new FormControl('');

    constructor( 
        private contentService: ContentService, 
        private courseService: CourseService,
        private moduleService: ModuleService,
        private cdRef: ChangeDetectorRef
    ) {
    }
    
    ngOnInit() {
        this.modules?.subscribe(res => {
            this.modulesSubject$.next(res);
            this.loading.emit(false);
        });
        this.content?.subscribe(res => {
            this.contentSubject$.next(res);
        });
    }

    sortedModules$ = this.modulesSubject$.asObservable().pipe(
        tap(res => {
            res.sort((m1, m2) => m1.order - m2.order);
            this.openedModules.next([res[0].moduleId || '']);
        }),
        map(modules => modules.map(module => {
                const blocks = this.getSortedModuleContent(module.moduleId);

                return {module: module, blocks: blocks}
            })
        )
    );

    getSortedModuleContent(moduleId: string){
        return this.content ? this.contentSubject$.asObservable().pipe(
            map(blocks => blocks.filter(b => b.moduleId == moduleId && (this.editing || this.notEmptyBlock(b.content.languages[this.lang], b.type) ))),
            tap(res => res.sort((b1, b2) => b1.order - b2.order)),
        ) : of([]);
    }

    // ------------ Editing -------------------------------


    // module
    dropModule(event: CdkDragDrop<{ module: Module, blocks: Observable<IObject[]> }[]>){
        const modules = this.modulesSubject$.value;

        if(event.previousIndex == event.currentIndex) return;
 
        moveItemInArray(modules, event.previousIndex + 1, event.currentIndex + 1);
        
        for(let i = event.currentIndex; i < modules.length; i++){
            modules[i].order = i;
            this.moduleService.putModule(modules[i]).subscribe(res => modules[i] = res);
        }
        this.modulesSubject$.next(modules);
    }
    
    onModuleOpen(id?: string){
        if(!id) return;
        this.openedModules.next([...this.openedModules.value, id]);

        this.editingModuleId.next('');
        this.moduleTitleForm.setValue('');
        this.editingBlockId.next('');
    }

    onModuleClose(id?: string){
        if(!id) return;
        const arr = this.openedModules.value; 
        arr.forEach((mId: string, index: number) => {
            if(mId == id){
                arr.splice(index, 1);
                return this.openedModules.next(arr);
            }
        })

        this.editingModuleId.next('');
        this.moduleTitleForm.setValue('');
        this.editingBlockId.next('');
    }

    onEditModule(moduleId: string, title: string){
        this.editingBlockId.next('');
        this.moduleTitleForm.setValue(title);
        this.editingModuleId.next(moduleId);
    }

    onSaveModule(editedModule: Module){
        const updatedModule = editedModule;
        const newTitle = this.moduleTitleForm.value;

        if(!updatedModule.languages) updatedModule.languages = {en: {title: newTitle || ''}} as _moduleLanguages;
        if(this.lang == languages.en) updatedModule.title =  newTitle || '';
        updatedModule.languages[this.lang].title =  newTitle || '';

        this.loading.emit(true);
        this.moduleService.putModule(updatedModule).subscribe(res => {
            const modules = this.modulesSubject$.value;
            const idx = modules.findIndex(m => m.moduleId == res.moduleId);
            if(idx == -1) return this.courseService.refreshCourse();
            modules[idx] = res;
            this.modulesSubject$.next(modules);
        }, err => {}, () => this.loading.emit(false));

        this.editingModuleId.next('');
        this.moduleTitleForm.setValue('');
        this.editingBlockId.next('');
    }

    onCancelModule(){
        this.editingModuleId.next('');
        this.moduleTitleForm.setValue('');
        this.editingBlockId.next('');
    }

    onDeleteModule(module: Module){
        const modules = this.modulesSubject$.value;
        let idx = modules.findIndex(m => m.moduleId == module.moduleId);
        if(idx != -1) {
            modules.splice(idx, 1);
            this.modulesSubject$.next(modules);
        }
        this.loading.emit(true);
        this.moduleService.deleteModule(module.courseId, module.moduleId).subscribe(res => {
            this.courseService.refreshCourse();
        }, err => {}, () => this.loading.emit(false));
    }

    // blocks

    dropBlock(ev: CdkDragDrop<IObject[]>, newId: string){
        const content = this.contentSubject$.value;
        
        if(ev.previousContainer == ev.container){
            if(ev.previousIndex == ev.currentIndex) return;
            moveItemInArray(ev.container.data, ev.previousIndex, ev.currentIndex);
        } 
        else transferArrayItem(ev.previousContainer.data, ev.container.data, ev.previousIndex, ev.currentIndex);
        
        ev.container.data.forEach((el: IObject, index: number) => {
            if(index >= ev.currentIndex) {
                el.order = index;
                el.moduleId = newId;
                el.loading = true;
                this.contentService.putObject(el).subscribe(res => {
                    el.loading = false;
                    el = res;  
                    this.cdRef.detectChanges();
                });
            }
        })
        this.contentSubject$.next(content);
    }

    onEditBlock(objectId: string){
        this.editingModuleId.next('');
        this.moduleTitleForm.setValue('');
        this.editingBlockId.next(objectId);
    }

    onSaveBlock(editedBlock?: IObject){
        const block = this.editBlockComponent.editedContent;
        if(!block) return console.log('No block');
        this.loading.emit(true);
        this.contentService.putObject(block).subscribe(res => {
            if(!editedBlock) return this.courseService.refreshCourse();
            const content = this.contentSubject$.value;
            let idx = content.findIndex(b => b.objectId == editedBlock.objectId);
            if(idx == -1) return this.courseService.refreshCourse();
            content[idx] = res;
            this.contentSubject$.next(content);
        }, err => {}, () => this.loading.emit(false));

        this.editingModuleId.next('');
        this.moduleTitleForm.setValue('');
        this.editingBlockId.next('');
    }

    onDeleteBlock(objectId: string){
        const content = this.contentSubject$.value;
        let idx = content.findIndex(b => b.objectId == objectId);
        if(idx != -1) {
            content.splice(idx, 1);
            this.contentSubject$.next(content);
        }
        this.loading.emit(true);
        this.contentService.deleteObject(objectId).subscribe(res => {
            this.courseService.refreshCourse();
        }, err => {}, () => this.loading.emit(false));

        this.editingModuleId.next('');
        this.moduleTitleForm.setValue('');
        this.editingBlockId.next('');
    }

    // utils
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

}