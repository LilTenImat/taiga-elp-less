import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Module } from './module';
import { ENDPOINTS } from '../../config';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({providedIn: 'root'})
export class ModuleService extends ApiService {
    constructor(http: HttpClient, auth: AuthService){
        super(http, auth)
    }

    _prepareBody(module: Module) {
        return {
            title: module.languages ? module.languages.en.title : module.title,
            order:  0 || module.order,
            languages: module.languages
        }
    }

    getModules = (courseId: string) => this.makeRequest<Module[]>({
        method: 'get',
        endpoint: `${ENDPOINTS.course}/${courseId}/modules`,
        authorization: true
    })

    getModule = (courseId: string, moduleId: string) => this.makeRequest<Module>({
        method: 'get',
        endpoint: `${ENDPOINTS.course}/${courseId}/modules/${moduleId}`,
        authorization: true
    })

    postModule = (module: Module) => this.makeRequest<Module>({
        method: 'post',
        endpoint: `${ENDPOINTS.course}/${module.courseId}/modules`,
        body: this._prepareBody(module),
        authorization: true
    })

    putModule = (module: Module) => this.makeRequest<Module>({
        method: 'put',
        endpoint: `${ENDPOINTS.course}/${module.courseId}/modules/${module.moduleId}`,
        body: this._prepareBody(module),
        authorization: true
    })

    deleteModule = (courseId: string, moduleId: string) => this.makeRequest<Module>({
        method: 'delete',
        endpoint: `${ENDPOINTS.course}/${courseId}/modules/${moduleId}`,
        authorization: true
    })

    
}