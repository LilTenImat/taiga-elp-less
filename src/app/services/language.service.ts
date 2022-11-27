import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { languages } from '../environment';

@Injectable({providedIn: 'root'})
export class LanguageService {
    private language$ = new BehaviorSubject<languages>(languages.en);
    public currentLanguage = this.language$.asObservable();

    constructor() { }

    setLanguage(lang: languages){
        this.language$.next(lang);
    }

    getLanguage(){
        return this.language$.value;
    }
    
}