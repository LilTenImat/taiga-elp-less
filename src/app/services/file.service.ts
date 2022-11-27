import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ENDPOINTS } from '../config';
import { Course } from '../course/course';
import { languages } from '../environment';

@Injectable({providedIn: 'root'})
export class FileService extends ApiService {
    constructor(http: HttpClient, auth: AuthService) {
        super(http, auth);
    }

    // Object
    getObjectFiles = (objectId: string) => this.makeRequest<{url: string, fileId: string}[]>({
        method: 'get',
        endpoint: `${ENDPOINTS.object}/${objectId}/file`,
        authorization: true,
    });
    

    getObjectFile = (objectId: string, fileId: string) => this.makeRequest<{url: string, fileId: string}>({
        endpoint: `${ENDPOINTS.object}/${objectId}/file/${fileId}`,
        method: 'get',
        authorization: true
    });

    postObjectFile = (objectId: string, file: any) => {
        const formData: FormData = new FormData();
        formData.append("file", file, file.name); 
        return this.makeRawRequest({
                endpoint:`${ENDPOINTS.object}/${objectId}/file`,
                body: formData, 
                method: 'post',
                authorization: true,
            },{
                headers: new HttpHeaders({"Authorization": 'Bearer ' + this.auth.getToken() }),
                reportProgress: true,
                observe: 'events'
            });
    }

    deleteObjectFile = (objectId: string, fileId: string) => this.makeRequest({
        endpoint:`${ENDPOINTS.object}/${objectId}/file/${fileId}`,
        method: 'delete',
        authorization: true,
    })

    postQuiz = (objectId: string, file: any, language: languages = languages.en, ) => {
        const formData: FormData = new FormData();
        formData.append("file", file, file.name); 
        
        return this.makeRawRequest({
                endpoint:`${ENDPOINTS.object}/${objectId}/quiz`, 
                body: formData,
                method: 'post',
                authorization: true,
            },{
                headers: new HttpHeaders({'Authorization': 'Bearer ' + this.auth.getToken() }),
                params: {lang: language},
                reportProgress: true,
                observe: 'events'
            });
    }

    exportQuiz = (objectId: string, language: languages = languages.en) => this.makeRawRequest({
            endpoint:`${ENDPOINTS.object}/${objectId}/quiz`,
            method: 'get',
            authorization: true,
        },{
            headers: new HttpHeaders({'Authorization': 'Bearer ' + this.auth.getToken() }),
            params: {lang: language},
            reportProgress: true,
            observe: 'events',
            responseType: 'blob',
        });

    postSubtitles = (objectId: string, file: any, language: languages = languages.en) => {
        const formData: FormData = new FormData();
        formData.append("file", file, file.name); 
        
        return this.makeRawRequest({
                endpoint:`${ENDPOINTS.object}/${objectId}/subtitles`, 
                body: formData,
                method: 'post',
                authorization: true,
            },{
                headers: new HttpHeaders({'Authorization': 'Bearer ' + this.auth.getToken() }),
                params: {lang: language},
                reportProgress: true,
                observe: 'events'
            });
    }


    // Course
    postCoursePicture = (courseId: string, file: any) => {
        const formData: FormData = new FormData();
        formData.append("file", file, file.name); 
        
        return this.makeRawRequest<Course>({
                endpoint:`${ENDPOINTS.course}/${courseId}/picture`, 
                body: formData,
                method: 'post',
                authorization: true
            }, {
                headers: new HttpHeaders({"Authorization": 'Bearer ' + this.auth.getToken() }),
                reportProgress: true,
                observe: 'events'
            }
        )
    }

    deleteCoursePicture = (courseId: string) => this.makeRequest({
        endpoint:`${ENDPOINTS.course}/${courseId}/picture`,
        method: 'delete',
        authorization: true,
    })

    postCourseCertificate = (file: any, courseId: string) => {
        const formData: FormData = new FormData();
        formData.append("file", file, file.name); 
        return this.makeRawRequest({
                endpoint:`${ENDPOINTS.course}/${courseId}/certificate`, 
                body: formData,
                method: 'post',
                authorization: true,
            }, {
                headers: new HttpHeaders({"Authorization": 'Bearer ' + this.auth.getToken() }),
                reportProgress: true,
                observe: 'events'
            });
    }

    // User
    postUserImage = (userId: string, file: any) => {
        const formData: FormData = new FormData();
        formData.append("file", file, file.name); 

        return this.makeRequest({
            endpoint:`${ENDPOINTS.user}/${userId}/picture`, 
            body: formData,
            method: 'post',
            authorization: true
        });
    }


 
}