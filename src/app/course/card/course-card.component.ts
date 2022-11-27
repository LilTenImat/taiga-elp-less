import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, skip, throwError, switchMap } from 'rxjs';
import { languages } from 'src/app/environment';
import { FileService } from 'src/app/services/file.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Course } from '../course';

@Component({
    selector: 'course-card',
    templateUrl: 'course-card.component.html',
    styleUrls: ['../course.component.less', 'card.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseCardComponent implements OnInit {
  @Input() mode: 'inlist' | 'onpage' | 'editing' = 'inlist';
  @Input() editor: boolean = false;
  private _course: Course | undefined;
  @Input() set course(val: Course | undefined){
    if(!val) return;
    this._course = val;

    if(!this._course.isJoined) this._course.isJoined = !!this._course.actions?.find(a => a.verb.type == 'join');

    this.form.patchValue({
      image: val.image,
      cardInfo: val.languages ? val.languages[this.lang].cardInfo : '',
      duration: val.duration
    }, {emitEvent: false});
  };
  get course(){return this._course};
  
  @Input() lang = languages.en;
  @Output() values = new EventEmitter();
  @Output() newLanguage = new EventEmitter<languages>();

  image = new FormControl('');
  form = new FormGroup({
    image: new FormControl(''),
    cardInfo: new FormControl(''),
    duration: new FormControl('', Validators.min(0)),
  })
  constructor(
    private fileService: FileService
  ) {
    this.form.valueChanges.pipe(distinctUntilChanged(), debounceTime(200)).subscribe(val => {
      if(!this.form.valid) return;
      this.values.emit(val);
    })

    this.image.valueChanges.pipe(debounceTime(200), switchMap(val => {
      this.image.disable();
      if(!val) return throwError(() => 'Form invalid!');
      const courseId = this.course?.courseId;
      if(!courseId) return throwError(() => 'No course to update picture!');
      return this.fileService.postCoursePicture(courseId, val)
    })).subscribe((httpEvent: HttpEvent<any>) => {
      if(httpEvent.type == HttpEventType.Response){
        this.form.patchValue({image: httpEvent.body.image || ''});
      }
    }, err => {}, () => {this.image.reset()})
  }
  
  onReject(ev: any){
    console.log(ev);
  }
  ngOnInit() { 
    if(this.mode != 'editing') this.form.disable();
  }

  getLangs(course: Course): string[]{
    if(course?.languages){
      return Object.keys(course.languages);
    } else {
      return [];
    }
  }
}