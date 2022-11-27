import { Component } from '@angular/core';

@Component({
    selector: 'app-icon',
    template: `<span class="material-symbols-outlined" style="padding: 5px;"><ng-content></ng-content></span>`
})
export class IconComponent {}