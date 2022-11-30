import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'button-toggle-group',
    templateUrl: 'button-toggle.component.html',
    styleUrls: ['button-toggle.component.less']
})

export class ButtonToggleComponent implements OnInit {
    @Input() values: {name: string, value: string}[] = [];
    @Input() size: 'l' | 'm' | 's'  = 'm';
    @Input() set state(value: string | null){
        this.stateForm.setValue(value, {emitEvent: false});
    }

    public get state(){
        return this.stateForm.value;
    }

    stateForm = new FormControl<string | null>(null);

    constructor() { }

    ngOnInit() { }
}