import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

import { Observable, of } from 'rxjs';
import { concatMap, map, tap } from 'rxjs/operators';
import { CourseService } from '../course/course.service';

@Injectable({ providedIn: 'root' })
export class ContentGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private courseService: CourseService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const {courseUrl, moduleUrl} = route.params;
        const contentOrder = Number(route.queryParams['content']) || 0;
        // console.log(courseUrl, moduleUrl, contentOrder)
        if(!courseUrl || !moduleUrl) return of(false);
        
        const joined = this.courseService.getCourse(courseUrl).pipe(map(course => {
            const module = course.modules?.find(m => m.url == moduleUrl)
            if(!module) return false;
            const block = course.content?.find(b => (b.moduleId == module.moduleId) && (b.order == contentOrder))
            if(!block) return false;
            
            const joined = !!course.actions.find(a => a.verb.type == 'join');
            if(joined) return true;
            
            return !!block.public;
        }));

        return this.authService.currentUser.pipe(concatMap(user => user ? ( user.admin ? of(true) : joined ) : of(false)));
    }
}