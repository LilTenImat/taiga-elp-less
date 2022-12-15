import { HttpEvent, HttpEventType } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { TuiFileLike } from '@taiga-ui/kit';
import { BehaviorSubject, catchError, filter, finalize, map, Observable, of, Subject, switchMap } from 'rxjs';
import { languages, TUI_EDITOR_TOOLS } from 'src/app/environment';
import { ButtonToggleComponent } from 'src/app/helpers/button-toggle/button-toggle.component';
import { FileService } from 'src/app/services/file.service';
import { Content, IObject, ObjectTypeEnum, emptyContent, _blockLanguages, Quiz, _question } from './content';
import { ContentService } from './content.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
    selector: 'edit-block',
    templateUrl: 'edit-block.component.html',
    styleUrls: ['content.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditBlockComponent implements OnInit {
    @ViewChild('toggle') toggle!: ButtonToggleComponent;
    editorTools = TUI_EDITOR_TOOLS;
    
    parentActive = false;
    childActive = false;

    quizActiveZone: number | null = null;

    @Input() content?: IObject;
    @Input() lang: languages = languages.en;
    @Input() final_test?: boolean; 
    @Input() type: ObjectTypeEnum = ObjectTypeEnum.ARTICLE;

    public get editedContent(){
        if(!this.content) return undefined;

        if(!this.content?.content){
            this.content.content = { languages: { en: emptyContent(this.type)  } as _blockLanguages}
        } 
        if(!this.content.title) this.content.title = this.contentForm.value.title || 'New block';
        this.content.content.languages[this.lang] = {...this.contentForm.value} as Content;


        return this.content;
    }

    contentForm = new FormGroup({
        title: new FormControl<string>(''),
        link: new FormControl<string>(''),
        text: new FormControl<string>(''),
        files: new FormControl<{url: string, fileId?: string}[]>([]),
        subtitles: new FormControl<string>(''),
        questions: new FormArray< FormGroup< {questionText: FormControl<string>, answers: FormArray< FormGroup< {answerText: FormControl<string>, isCorrect: FormControl<boolean>} > >} > >([]),
        final_test: new FormControl<boolean>(false),
        welcome: new FormControl<string>(''),
        texts: new FormControl<string[]>([]),
        titles: new FormControl<string[]>([]),
    })

    fileControl = new UntypedFormControl();
    quizFileControl = new UntypedFormControl();

    readonly loadingFiles$ = new Subject<TuiFileLike | null>();
    readonly rejectedFiles$ = new Subject<TuiFileLike | null>();
    readonly loadedFiles$ = this.fileControl.valueChanges.pipe(
        switchMap((file => {
            return file ? this.uploadFile(file) : of(null);
        } ))
    );

    constructor(
        private contentService: ContentService,
        private fileService: FileService,
        private fb: FormBuilder
    ){
        this.quizFileControl.valueChanges.pipe(
            switchMap(file => file && this.content ? this.fileService.postObjectFile(this.content.objectId, file) : of(null) )
        ).subscribe(res => {
            if(!res) return;
            switch (res.type){
                case HttpEventType.Response: {
                    if(this.toggle) this.toggle.state = 'text';
                    this.quizFileControl.setValue(null);
                    this.contentForm.patchValue({
                        questions: res.body ? (res.body.content.languages[this.lang] as Quiz).questions || [] : []
                    })
                }
            }
        });
    }

    ngOnInit() { 
        if(!this.content) return;
        this.contentForm.patchValue({
            ...this.content.content.languages[this.lang]
        }, {emitEvent: false});

        if(this.content.type == ObjectTypeEnum.QUIZ){
            const questions = (this.content.content.languages[this.lang] as Quiz).questions;
            const form = this.contentForm.controls.questions;
    
            for(let q of questions){
                form.push(
                    this.fb.group({
                        questionText: this.fb.control(q.questionText) as FormControl<string>,
                        answers: this.fb.array(
                            q.answers.map(ans => this.fb.group({
                                isCorrect: this.fb.control(ans.isCorrect) as FormControl<boolean>,
                                answerText: this.fb.control(ans.answerText) as FormControl<string>
                            }))
                        )
                    })
                )
            }
        }
    }

    addQuestion() {
        const controls = this.contentForm.controls.questions;

        const questionForm = this.fb.group({
          questionText: this.fb.control('') as FormControl<string>,
          answers: this.fb.array([
            this.fb.group({
                answerText: this.fb.control('') as FormControl<string>,
                isCorrect: this.fb.control(false) as FormControl<boolean>
            })
          ])
        });
        controls.push(questionForm);
        this.onQuizActiveZone(true, (controls.length || 1) - 1);
        setTimeout(
            () => (document.querySelector(`#question-${controls.length - 1}`) as HTMLInputElement )?.focus(),
            100
        )
    }
  
    deleteQuestion(qIndex: number) {
        this.contentForm.controls.questions.removeAt(qIndex);
        if(qIndex != 0) setTimeout(
            () => (document.querySelector(`#question-${qIndex - 1}`) as HTMLInputElement )?.focus(),
        100)
    }

    addAnswer(qIndex: number){
        const controls =  this.contentForm.controls.questions.controls[qIndex].controls.answers;
        const answerForm = this.fb.group({
            answerText: this.fb.control('') as FormControl<string>,
            isCorrect: this.fb.control(false) as FormControl<boolean>
        })
        controls.push(answerForm);
        setTimeout(
            () => (document.querySelector(`#answer-${controls.length - 1}`) as HTMLInputElement )?.focus(),
            100
        )
    }

    deleteAnswer(qIndex: number, aIndex: number){
        this.contentForm.controls.questions.controls[qIndex].controls.answers.removeAt(aIndex);
        if(aIndex != 0) setTimeout(
            () => (document.querySelector(`#answer-${aIndex - 1}`) as HTMLInputElement )?.focus(),
        100)
    }

    dropQuestion(event: CdkDragDrop<FormGroup[]>){
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        if(this.quizActiveZone != null)
        this.quizActiveZone = event.currentIndex;
    }

    dropAnswer(event: CdkDragDrop<FormGroup[]>){
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }

    uploadFile(file: TuiFileLike): Observable<TuiFileLike | null> {
        if(!this.content) return of(null);
        this.loadingFiles$.next(file);
 
        return this.fileService.postObjectFile(this.content.objectId, file).pipe(
            map((httpEvent: HttpEvent<any>) => {
                switch (httpEvent.type) { 
                    case HttpEventType.UploadProgress: {
                        return null;
                    }

                    case HttpEventType.Response: {
                        // console.log(httpEvent.body);

                        return {
                            name: '',
                            size: 0
                        } as TuiFileLike
                    };

                    default: return null;
                }
            }),
            catchError(() => {
                this.rejectedFiles$.next(file);
                this.loadingFiles$.next(null);
                return of(null);
            }),
        )
    }

    removeFile(index?: number){
        if(!index){
            this.fileControl.setValue(null);
        } else {
            let arr = this.fileControl.value;
            arr.splice(index, 1)
            this.fileControl.setValue([...arr]);
        } 
    }

    onReject(file: TuiFileLike | readonly TuiFileLike[]){
        this.rejectedFiles$.next(file as TuiFileLike);
    }

    clearRejected(): void {
        this.removeFile();
        this.rejectedFiles$.next(null);
    }
    onQuizActiveZone(active: boolean, index: number) {
        if(!active){
            if(this.quizActiveZone == index) return this.quizActiveZone = null;
            if(this.quizActiveZone == null) this.quizActiveZone = index;
        } else {
            this.quizActiveZone = index;
        }
        return null;
        // this.quizActiveZone = index;
    }
    // log = console.log


    answerKey(ev: any, qIndex: number, aIndex: number){
        if(aIndex != 0)
        if(!ev.target.value) this.deleteAnswer(qIndex, aIndex);
    }

    questionKey(ev: any,  qIndex: number){
        if(qIndex != 0)
        if(!ev.target.value) this.deleteQuestion(qIndex);
    }
}