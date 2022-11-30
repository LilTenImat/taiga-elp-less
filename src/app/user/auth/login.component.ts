import { Component, Inject, Input, OnInit, Injector } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { TuiAlertService, TuiButtonComponent, TuiNotification } from '@taiga-ui/core';
import { Observable } from 'rxjs';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {switchMap, takeUntil} from 'rxjs/operators'
import { Router } from '@angular/router';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html',
    styleUrls: ['auth.component.less']
})

export class LoginComponent implements OnInit {

    @Input() embed: boolean = false;
    showLoader: boolean = false;
    readonly errNotification: Observable<void>;
    constructor(
        @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
        private authService: AuthService,
        private router: Router,
    ) {
    this.errNotification = alertService.open<void>(
            '',
            {
                label: `Something went wrong!`,
                status: TuiNotification.Error,
                autoClose: true,
            },
        )
        .pipe(
            takeUntil(router.events),
        );
    }

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)])
    })
    ngOnInit() {
        
    }

    onSubmit(ev: SubmitEvent){
        this.showLoader = true;
        this.authService.login(
            this.loginForm.controls.email.value || '',
            this.loginForm.controls.password.value || ''
        ).subscribe(res => {
            this.showLoader = false;
            this.router.navigate(['/']);
        }, err => {
            this.errNotification.subscribe();
            this.showLoader = false; 
        })
    }
}