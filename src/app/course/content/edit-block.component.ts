import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { languages, TUI_EDITOR_TOOLS } from 'src/app/environment';
import { Content, IObject, ObjectTypeEnum, emptyContent, _blockLanguages } from './content';


@Component({
    selector: 'edit-block',
    templateUrl: 'edit-block.component.html',
    styleUrls: ['content.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class EditBlockComponent implements OnInit {
    editorTools = TUI_EDITOR_TOOLS;
    
    @Input() content?: IObject;
    @Input() lang: languages = languages.en;
    @Input() final_test?: boolean; 
    @Input() type: ObjectTypeEnum = ObjectTypeEnum.ARTICLE;

    @Output() contentChange = new EventEmitter<IObject>();

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
        questions: new FormControl<{questionText: string, answers: {answerText: string, isCorrect: boolean }[]}[]>([]),
        final_test: new FormControl<boolean>(false),
        welcome: new FormControl<string>(''),
        texts: new FormControl<string[]>([]),
        titles: new FormControl<string[]>([]),
    })


    ngOnInit() { 
        if(!this.content) return;
        this.contentForm.patchValue({
            ...this.content.content.languages[this.lang]
        }, {emitEvent: false});
    }
}