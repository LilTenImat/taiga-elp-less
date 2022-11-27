import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, concatMap, debounceTime, map, Observable, Subject, tap } from 'rxjs';
import { ThemeService } from 'src/app/services/theme.service';
import { Course } from '../course';
import { CourseService } from '../course.service';
import {tuiPure} from '@taiga-ui/cdk';
import {TuiDurationOptions, tuiFadeInList, tuiFadeIn} from '@taiga-ui/core';
import {animate, query, stagger, state, style, transition, trigger} from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl } from '@angular/forms';

// const TRANSITION = `{{duration}}ms {{delay}}ms ease-in-out`;
// const DURATION = {params: {duration: 300}};

@Component({
    selector: 'course-list',
    templateUrl: 'course-list.component.html',
    styleUrls: ['../course.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [tuiFadeIn, tuiFadeInList]
})

export class CourseListComponent implements OnInit {
    courses$ = new BehaviorSubject<readonly Course[] | null>(null);
    
    benefits = [
        {
          icon: 'icon1.png', 
          title: 'Learn on the move', 
          text: 'Our courses are available for you anytime and anywhere. You can learn on your laptop, smartphone or tablet 24/7.'
        },
        {
          icon: 'icon2.png', 
          title: 'Learn from experts', 
          text: 'Our courses bring first-class training and expertise directly to you via e-learning. Regardless of your geography.'
        },
        {
          icon: 'icon3.png', 
          title: 'Save money', 
          text: 'Online courses are at least 10-times cheaper than similar traditional classroom training. And you don’t have to take time off to do it!'
        },
    ]
    
    partners = [
    {
        title: 'Road Traffic Injury Prevention',
        content: {
        intro: 'Road Traffic Injury Prevention is a free,  online training certificate program.',
        url: 'https://courseplus.jhu.edu/core/index.cfm/go/course.home/coid/8140/',
        logo: '/assets/images/partner_course_logo1.png'
        }
    },
    {
        title: 'Roaf Safety Legislation',
        content: {
        intro: 'Roaf Safety Legislation is a free,  online training certificate program.',
        url: 'https://courseplus.jhu.edu/core/index.cfm/go/course.home/coID/8092/',
        logo: '/assets/images/partner_course_logo2.png'
        }
    },
    {
        title: 'Protect Yourself and Your Cargo',
        content: {
        intro: 'Protect Yourself and Your Cargo is a free,  online training certificate program.',
        url: 'https://www.iru.org/iru-academy/programmes/protect-yourself-and-your-cargo',
        logo: '/assets/images/partner_course_logo3.png'
        }
    }
    ]

    
    editor: boolean = false;
    publishedCourses = new FormControl<boolean>(true);

    isDarkTheme$ = this.themeService.isDarkTheme$;
    constructor(
        private courseService: CourseService,
        private themeService: ThemeService,
        private auth: AuthService
    ) {
        this.auth.currentUserEditor.pipe(
            tap(isEditor =>  {this.publishedCourses.setValue(isEditor, {emitEvent: false}); this.editor = isEditor;}),
            concatMap(isEditor => courseService.getCourses(!isEditor)
        )).subscribe(courses => this.courses$.next(courses));

        this.publishedCourses.valueChanges.pipe(
            debounceTime(500),
            concatMap(value => courseService.getCourses(!value))
        ).subscribe(courses => this.courses$.next(courses));
    }

    ngOnInit() { }

    @tuiPure
    getAnimation(duration: number = 1000, delay: number = 0): TuiDurationOptions {
        return {value: ``, params: {duration: `${duration}ms ${delay}` as unknown}} as TuiDurationOptions;
    }
}
