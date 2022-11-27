import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, map, Subject } from 'rxjs';
import { languages } from 'src/app/environment';
import { Course } from '../course';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['content.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ContentComponent implements OnInit {
    courseSubject$ = new BehaviorSubject<Course | undefined>(undefined);
    course$ = this.courseSubject$.asObservable();
    openModules = false;

    @Input() set course(val: Course){this.courseSubject$.next(val);}
    @Input() lang: languages = languages.en;


    constructor() { }

    ngOnInit() { }

    getModules = () => this.course$.pipe(map(course => course?.modules || []));
    getContent = () => this.course$.pipe(map(course => course?.content || []));
    
}