import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

interface RequestOpts {
    method: 'get' | 'post' | 'put' | 'delete';
    authorization?: boolean;
    endpoint: string;
    body?: any;
    query?: any;
  }
  
@Injectable({providedIn: 'root'})
export class ApiService {

    private token?: string;

    constructor(protected http: HttpClient, protected auth: AuthService) { 
      this.authorize(this.auth.getToken());
    }

    public authorize(token: string) {
      this.token = token;
    }

    public unauthorize() {
      this.token = undefined;
    }

    protected makeRequest<T>(requestOpts: RequestOpts) {
      const headers = { 'Content-Type': 'application/json', Authorization: '' };

      if (requestOpts.authorization)
        headers['Authorization'] = 'Bearer ' + this.auth.getToken();
      if (this.token) headers['Authorization'] = 'Bearer ' + this.token;
      const httpOptions = { headers: new HttpHeaders(headers) };
      if (!!requestOpts.query) {
        const query = '?' + new URLSearchParams(requestOpts.query).toString();
        requestOpts.endpoint += query;
      }
  
      let response;
      switch (requestOpts.method) {
        case 'get':
          response = this.http.get<T>(requestOpts.endpoint, httpOptions);
          break;
        case 'post':
          response = this.http.post<T>(
            requestOpts.endpoint,
            requestOpts.body,
            httpOptions,
          );
          break;
        case 'put':
          response = this.http.put<T>(
            requestOpts.endpoint,
            requestOpts.body,
            httpOptions,
          );
          break;
        case 'delete':
          response = this.http.delete<T>(
            requestOpts.endpoint,
            httpOptions,
          );
          break;
      }
      return response;
    }

    protected makeRawRequest<T>(requestOpts: RequestOpts, httpOptions?: any){
      let response;
      switch (requestOpts.method) {
        case 'get':
          response = this.http.get<T>(requestOpts.endpoint, httpOptions);
          break;
        case 'post':
          response = this.http.post<T>(
            requestOpts.endpoint,
            requestOpts.body,
            httpOptions,
          );
          break;
        case 'put':
          response = this.http.put<T>(
            requestOpts.endpoint,
            requestOpts.body,
            httpOptions,
          );
          break;
        case 'delete':
          response = this.http.delete<T>(
            requestOpts.endpoint,
            httpOptions,
          );
          break;
      }
      return response;
    }

}