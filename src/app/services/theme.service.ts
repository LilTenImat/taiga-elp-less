import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

export enum themes{
    dark = 'dark',
    light = 'light'
}

const ELP_PREFERED_THEME = 'elp-prefered-theme';

@Injectable({providedIn: 'root'})
export class ThemeService {
 
    private themeSource$ = new BehaviorSubject<themes>(themes.light);
    currentTheme$ = this.themeSource$.asObservable();
    isDarkTheme$ = this.currentTheme$.pipe(map(theme => theme == themes.dark));

    constructor() {
        const theme = localStorage.getItem(ELP_PREFERED_THEME);
        if(theme) this.themeSource$.next(theme as themes);
        localStorage.setItem(ELP_PREFERED_THEME, `${this.themeSource$.value}`);
    }
    
      
  setTheme(theme: themes){
    this.themeSource$.next(theme);
    localStorage.setItem(ELP_PREFERED_THEME, `${this.themeSource$.value}`);
  }
    
}