import jwt_decode from "jwt-decode";
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, filter, map, tap } from 'rxjs/operators';

import { ENDPOINTS } from '../config';
import { User } from '../user/user';
import { Router } from "@angular/router";
import { TuiAlertService } from "@taiga-ui/core";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
  private currentUserSubject: BehaviorSubject<User | null | undefined> = new BehaviorSubject<User | null | undefined>(undefined);
  public currentUser = this.currentUserSubject.asObservable().pipe(filter(u => u !== undefined));

  public currentUserEditor = this.currentUser.pipe( map(user => user ? ( user.admin || user.editor ) : false ) );
  public currentUserAdmin = this.currentUser.pipe( map(user => !!user?.admin) );

  tokenName = 'elpUserToken';

  constructor(        
    private http: HttpClient,
    private router: Router,
  ) {
    this.init();
  }
  init() {
    let t = localStorage.getItem(this.tokenName);
    if (t){
      let payload = <User>jwt_decode(t);
      payload.token = t;
      // this.currentUserSubject.next(payload);
      let httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + t })
      };
      this.http.get<User>(`${ENDPOINTS.user}/${payload.sub}`, httpOptions).subscribe(user => {
        user.token = t ? t : '';
        this.currentUserSubject.next(user);
      }, error => {
        this.currentUserSubject.next(null);
      });
    } else {
      this.currentUserSubject.next(null);
    }
  }

  getHttpOptions(params?: any){
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.getToken() }),
      params: params
    };
    return httpOptions;
  }
  
  getCurrentUserValue(): User | null | undefined{
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    const body = {
      email: email,
      password: password
    }
    return this.http.post<any>(`${ENDPOINTS.auth}` , body).pipe(
      concatMap(
        token => {
          localStorage.setItem(this.tokenName, token.token);
          let user = jwt_decode(token.token) as User;     
          return this.http.get<User>(`${ENDPOINTS.user}/${user.sub}`, this.getHttpOptions())
        }
      ), tap(user => {
        this.currentUserSubject.next(user); 
      }),
      catchError(val => {
        this.currentUserSubject.next(null);
        return throwError(() => val);
      })
    );
  }

  register(email: string, password: string, name: string, surname: string): Observable<any>{
    const body = {
        email: email,
        password: password,
        name: name,
        surname: surname
      }
      return this.http.post(`${ENDPOINTS.auth}/registration`, body);
  }

  logout() {
    localStorage.removeItem(this.tokenName);
    localStorage.removeItem('emailVerifyed');
    this.currentUserSubject.next(null);
  }
  
  getToken(): string{
    let token = localStorage.getItem(this.tokenName);
    return token ? token : '';
  }

  getTokenedUser(): User | undefined{
    let user = undefined;
    let token = localStorage.getItem(this.tokenName);
    if(token){
      user = <User>jwt_decode(token);
      user.userId = user.sub;
    }
    return user;
  }

  sendRecoveryEmail(email: string): Observable<any>{
    return this.http.post<any>(`${ENDPOINTS.auth}/recovery/${email}`, {}, this.getHttpOptions());
  }

  resetPassword(email: string, token: string, password: string): Observable<any>{
    return this.http.post<any>(`${ENDPOINTS.auth}/change-password/${email}/${encodeURIComponent(token)}/${encodeURIComponent(password)}`, {}, this.getHttpOptions());
  }

  verifyMail(email: string, token: string): Observable<User>{
    return this.http.post<User>(`${ENDPOINTS.auth}/verify/?token=${token}&email=${email}`, {}, this.getHttpOptions())
  }

  sendVerifyEmail(email: string): Observable<User>{
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.http.post<User>(`${ENDPOINTS.auth}/verify/${email}`, {}, httpOptions)
  }
}