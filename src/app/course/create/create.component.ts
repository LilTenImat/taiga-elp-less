import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from '../course.service';
import { Course } from '../course';

@Component({
    selector: 'create',
    templateUrl: 'create.component.html',
    styleUrls: ['create.component.less']
})

export class CreateCourseComponent implements OnInit {

    form = new FormGroup({
        title: new FormControl('', [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(128)
        ])
    })

    constructor(
        private courseService: CourseService,
        private router: Router
    ) { }

    ngOnInit() { }

    onSubmit(){
        this.courseService.postCourse(<Course>{
            title: this.form.controls.title.value, 
            courseLanguages: ['English'], 
            languages: {
              en: {
                title: this.form.controls.title.value
              }
            },
            quizThreshold: 50,
            mode: 'free',
        }).subscribe(res => {
            this.router.navigate(['/course/' + res.url ], {queryParams: {editing: 'landing'} })
        })
    }
}