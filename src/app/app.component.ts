import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'taiga-elp-less';
  isDarkTheme$ = this.themeService.isDarkTheme$;


  tb_h = false;
  bb_h = false;
  
  constructor(
    private themeService: ThemeService,
    private router: Router
  ){
    router.events.subscribe(ev => {
      if(ev instanceof NavigationEnd) {
        this.tb_h = ev.url.includes('login') || ev.url.includes('signup');
        this.bb_h = this.tb_h || ev.url.includes('welcome');
      }
    });
  }

}
