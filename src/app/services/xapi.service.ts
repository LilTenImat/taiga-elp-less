import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { XapiStatement } from '../interfaces/xapiStatement';
import { ApiService } from './api.service';
import { concatMap, Observable, throwError } from 'rxjs';
import { User } from '../user/user';
import { AuthService } from './auth.service';
import { ENDPOINTS } from '../config';

@Injectable({providedIn: 'root'})
export class XapiService extends ApiService {

    $user: Observable<User | null | undefined>;

    constructor(http: HttpClient, auth: AuthService){
        super(http, auth);
        this.$user = this.auth.currentUser
    }
    
    postAction = (verb: 'join' | 'complete', objectId: string, progress?: number) => {
        return this.$user.pipe(concatMap(user => {
            if(!user) return throwError(() => 'Unauthorized!');
            const body = {
                actor: {
                    userId: user.userId
                },
                verb: {
                    type: verb,
                    progress: progress
                },
                object: {
                    objectId: objectId
                }
            }
            return this.makeRequest<XapiStatement>({
                    method: 'post',
                    endpoint: `${ENDPOINTS.action}`,
                    body: JSON.stringify(body),
                    authorization: true,
                });
            })
        )
      }
    
    putAction = (actionId: string, actor: string, verb: string, object: string, progress?: number) => {
        return this.$user.pipe(concatMap(user => {
            if(!user) return throwError(() => 'Unauthorized!');
            const body = {
                actor: {
                  userId: actor
                },
                verb: {
                  type: verb,
                  progress: progress
                },
                object: {
                  objectId: object
                }
            }
            return this.makeRequest<XapiStatement>({
                    method: 'put',
                    endpoint: `${ENDPOINTS.action}/byid/${actionId}`,
                    body: JSON.stringify(body),
                    authorization: true,
                });
            })
        )
      }
    
    getActionsByUser = (objectId?: string) => {
        return this.$user.pipe(concatMap(user => {
            if(!user) return throwError(() => 'Unauthorized!');
            return this.makeRequest<XapiStatement[]>({
                    method: 'get',
                    endpoint: `${ENDPOINTS.action}/${user.userId}/${(objectId ? 'object/' + objectId : '')}`,
                    authorization: true,
                });
            })
        )
      }
    
    getActionsByUserId = (userId: string) => {
        return this.$user.pipe(concatMap(user => {
            if(!user) return throwError(() => 'Unauthorized!');
            return this.makeRequest<XapiStatement[]>({
                    method: 'get',
                    endpoint: `${ENDPOINTS.action}/${userId}`,
                    authorization: true,
                });
            })
        )
    }
    
    getActionsByCourse = (courseId: string) => {
        return this.$user.pipe(concatMap(user => {
            if(!user) return throwError(() => 'Unauthorized!');
            return this.makeRequest<XapiStatement[]>({
                    method: 'get',
                    endpoint: `${ENDPOINTS.course}/${courseId}/actions/${user.userId}`,
                    authorization: true,
                });
            })
        )
    }
    
}