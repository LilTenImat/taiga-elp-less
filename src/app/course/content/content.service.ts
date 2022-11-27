import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { IObject, ObjectTypeEnum } from './content';
import { ENDPOINTS } from '../../config';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({providedIn: 'root'})
export class ContentService extends ApiService {
    constructor(http: HttpClient, auth: AuthService){
        super(http, auth)
    }

    _prepareBody(block: IObject) {
        return {
            objectId: '',
            title: block.content ? block.content.languages.en.title : block.title,
            type: block.type,
            content: block.content,
            order: block.order,
            courseId: block.courseId,
            moduleId: block.moduleId,
        }
    }

    postObject = (block: IObject) => this.makeRequest<IObject>({
        method: 'post',
        body: this._prepareBody(block),
        endpoint: `${ENDPOINTS.object}`,
        authorization: true
    })
    
    getObjects = (type?: ObjectTypeEnum) => this.makeRequest<IObject[]>({
        method: 'get',
        endpoint: `${ENDPOINTS.object}`,
        authorization: true,
        query: {type: type}
    })

    getObject = (objectId: string) => this.makeRequest<IObject>({
        method: 'get',
        endpoint: `${ENDPOINTS.object}/${objectId}`,
        authorization: true,
    })

    putObject = (object: IObject) => this.makeRequest<IObject>({
        method: 'put',
        body: this._prepareBody(object),
        endpoint: `${ENDPOINTS.object}/${object.objectId}`,
        authorization: true,
    })

    deleteObject = (objectId: string) => this.makeRequest<IObject>({
        method: 'delete',
        endpoint: `${ENDPOINTS.object}/${objectId}`,
        authorization: true,
    })


}