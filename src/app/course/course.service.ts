import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../services/api.service';
import { Course } from './course';
import { AuthService } from '../services/auth.service';
import { ENDPOINTS } from '../config';
import { BehaviorSubject, concatMap, filter, map, of, OperatorFunction, Subject, tap, throwError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CourseService extends ApiService {

    currentCourse$ = new BehaviorSubject<Course | null>(null);

    constructor(http: HttpClient, auth: AuthService){
        super(http, auth)
    }

    _prepareBody(course: Course): Course {
        const data = Object.assign({}, course);
        delete data.url;
        delete data.content;
        delete data.modules;
        data.courseLanguages = data.courseLanguages ? data.courseLanguages : [];
        return data;
    }
  
    getCourses = (published: boolean = true) =>  this.makeRequest<Course[]>({
      method: 'get',
      endpoint: `${ENDPOINTS.course}`,
      authorization: true,
      query: { published: published },
    })


    refreshCourse(courseId?: string){
      const course = this.currentCourse$.value;
      if(!courseId && !course) return;
      if(course && course.courseId != courseId) this.currentCourse$.next(null);

      this.http.get<Course>(`${ENDPOINTS.course}/${courseId || course?.courseId}`, {
        headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + this.auth.getToken()},
      }).subscribe(res => this.currentCourse$.next(res));
    }

    getCourse = (courseId: string, options?: {update: boolean}) => {
      const course = this.currentCourse$.value;
      if(!course ||options?.update || (course && course.courseId != courseId && course.url != courseId) )
        this.refreshCourse(courseId);
      
      return this.currentCourse$.asObservable().pipe(filter(course => course != null) as OperatorFunction<Course | null, Course>);
    }


    postCourse = (course: Course) => {
      const data = this._prepareBody(course);
      return this.makeRequest<Course>({
        method: 'post',
        endpoint: `${ENDPOINTS.course}/`,
        body: data,
        authorization: true,
      });
    }

    putCourse = (course: Course) => this.makeRequest<Course>({
      method: 'put',
      endpoint: `${ENDPOINTS.course}/${course.courseId}`,
      body: course,
      authorization: true,
    });

    deleteCourse = (courseId: string) =>
      this.makeRequest<Course>({
        method: 'delete',
        endpoint: `${ENDPOINTS.course}/${courseId}`,
        authorization: true,
    })

    publishCourse = (courseId: string, publish: boolean) =>
      this.makeRequest<Course>({
        method: 'put',
        endpoint: `${ENDPOINTS.course}/${courseId}/${
          publish ? 'publish' : 'unpublish'
        }`,
        authorization: true,
    })

    getCertificate = (courseId: string) => {
      this.auth.currentUser.pipe(concatMap(user => {
          if(!user) return throwError(() => 'Unauthorized!');
          return this.makeRequest<{Location: string}>({
              method: 'post',
              endpoint: `${ENDPOINTS.course}/${courseId}/certificate/${user.userId}`,
              authorization: true,
            })
      }))
    }
    
}